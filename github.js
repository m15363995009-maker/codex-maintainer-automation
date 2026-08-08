const API_ROOT = "https://api.github.com";
const API_VERSION = "2022-11-28";

class GithubApiError extends Error {
  constructor(message, { status, url, responseBody } = {}) {
    super(message);
    this.name = "GithubApiError";
    this.status = status;
    this.url = url;
    this.responseBody = responseBody;
  }
}

function parsePullRequestUrl(input) {
  let url;
  try {
    url = new URL(input);
  } catch {
    throw new Error(`Invalid pull request URL: ${input}`);
  }

  if (url.protocol !== "https:" || !["github.com", "www.github.com"].includes(url.hostname)) {
    throw new Error("Only HTTPS github.com pull request URLs are supported");
  }

  const match = url.pathname.match(/^\/([^/]+)\/([^/]+)\/pull\/(\d+)\/?$/);
  if (!match) {
    throw new Error("Expected a URL like https://github.com/owner/repo/pull/123");
  }

  const [, owner, repo, number] = match;
  return {
    owner,
    repo,
    number: Number(number),
    htmlUrl: `https://github.com/${owner}/${repo}/pull/${number}`,
  };
}

function requestHeaders(token, accept = "application/vnd.github+json") {
  const headers = {
    Accept: accept,
    "User-Agent": "codex-maintainer-automation",
    "X-GitHub-Api-Version": API_VERSION,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function request(url, {
  token = "",
  method = "GET",
  body,
  accept = "application/vnd.github+json",
  fetchImpl = globalThis.fetch,
  timeoutMs = 15000,
} = {}) {
  if (typeof fetchImpl !== "function") {
    throw new Error("A fetch implementation is required");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const headers = requestHeaders(token, accept);
    if (body !== undefined) headers["Content-Type"] = "application/json";
    const response = await fetchImpl(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    const responseBody = await response.text();
    if (!response.ok) {
      throw new GithubApiError(
        `GitHub API request failed (${response.status})`,
        { status: response.status, url, responseBody },
      );
    }
    return responseBody;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`GitHub API request timed out after ${timeoutMs}ms: ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function requestJson(url, options = {}) {
  const responseBody = await request(url, options);
  if (!responseBody.trim()) {
    return null;
  }
  try {
    return JSON.parse(responseBody);
  } catch {
    throw new Error(`GitHub API returned invalid JSON: ${url}`);
  }
}

async function requestText(url, options = {}) {
  return request(url, options);
}

function parseDiffFiles(diff) {
  const files = [];
  let current = null;

  for (const line of String(diff || "").split("\n")) {
    const fileMatch = line.match(/^diff --git a\/(.+) b\/(.+)$/);
    if (fileMatch) {
      current = {
        filename: fileMatch[2],
        status: "modified",
        additions: 0,
        deletions: 0,
        changes: 0,
      };
      files.push(current);
      continue;
    }

    if (!current) continue;
    if (line.startsWith("new file mode")) {
      current.status = "added";
    } else if (line.startsWith("deleted file mode")) {
      current.status = "removed";
    } else if (line.startsWith("rename from") || line.startsWith("rename to")) {
      current.status = "renamed";
    } else if (line.startsWith("+") && !line.startsWith("+++")) {
      current.additions += 1;
      current.changes += 1;
    } else if (line.startsWith("-") && !line.startsWith("---")) {
      current.deletions += 1;
      current.changes += 1;
    }
  }

  return files;
}

async function fetchPullRequest(input, {
  token = "",
  fetchImpl = globalThis.fetch,
  apiRoot = API_ROOT,
  timeoutMs = 15000,
} = {}) {
  const identity = parsePullRequestUrl(input);
  const base = `${apiRoot}/repos/${identity.owner}/${identity.repo}`;
  const pullUrl = `${base}/pulls/${identity.number}`;
  const filesUrl = `${pullUrl}/files?per_page=100`;

  const [pull, files, diff] = await Promise.all([
    requestJson(pullUrl, { token, fetchImpl, timeoutMs }),
    requestJson(filesUrl, { token, fetchImpl, timeoutMs }),
    requestText(pullUrl, {
      token,
      fetchImpl,
      timeoutMs,
      accept: "application/vnd.github.v3.diff",
    }),
  ]);

  const apiFiles = Array.isArray(files) ? files : [];
  const parsedFiles = parseDiffFiles(diff);
  const normalizedFiles = apiFiles.length
    ? apiFiles.map((file) => ({
      filename: file.filename,
      status: file.status || "modified",
      additions: Number(file.additions || 0),
      deletions: Number(file.deletions || 0),
      changes: Number(file.changes || 0),
    }))
    : parsedFiles;

  return {
    ...identity,
    htmlUrl: pull?.html_url || identity.htmlUrl,
    title: pull?.title || "",
    body: pull?.body || "",
    author: pull?.user?.login || "unknown",
    baseRef: pull?.base?.ref || "",
    headRef: pull?.head?.ref || "",
    changedFiles: Number(pull?.changed_files ?? normalizedFiles.length),
    additions: Number(pull?.additions ?? normalizedFiles.reduce((sum, file) => sum + file.additions, 0)),
    deletions: Number(pull?.deletions ?? normalizedFiles.reduce((sum, file) => sum + file.deletions, 0)),
    files: normalizedFiles,
    diff,
  };
}

module.exports = {
  API_ROOT,
  GithubApiError,
  fetchPullRequest,
  parseDiffFiles,
  parsePullRequestUrl,
  request,
  requestJson,
  requestText,
};
