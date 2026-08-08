const API_ROOT = "https://api.openai.com/v1";

class OpenAIReviewError extends Error {
  constructor(message, { status, url, responseBody } = {}) {
    super(message);
    this.name = "OpenAIReviewError";
    this.status = status;
    this.url = url;
    this.responseBody = responseBody;
  }
}

function extractOutputText(payload) {
  if (typeof payload?.output_text === "string") {
    return payload.output_text.trim();
  }

  const parts = [];
  for (const item of Array.isArray(payload?.output) ? payload.output : []) {
    for (const content of Array.isArray(item?.content) ? item.content : []) {
      if (content?.type === "output_text" && typeof content.text === "string") {
        parts.push(content.text);
      }
    }
  }
  return parts.join("\n").trim();
}

async function requestOpenAIReview(prompt, {
  apiKey = process.env.OPENAI_API_KEY || "",
  model = process.env.OPENAI_MODEL || "gpt-5-mini",
  apiRoot = API_ROOT,
  fetchImpl = globalThis.fetch,
  timeoutMs = 30000,
} = {}) {
  if (!apiKey) {
    throw new OpenAIReviewError("OPENAI_API_KEY is required for OpenAI mode");
  }
  if (typeof fetchImpl !== "function") {
    throw new OpenAIReviewError("A fetch implementation is required");
  }

  const url = `${apiRoot.replace(/\/$/, "")}/responses`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "codex-maintainer-automation/0.1.0",
      },
      body: JSON.stringify({
        model,
        input: prompt,
        store: false,
      }),
      signal: controller.signal,
    });
    const responseBody = await response.text();
    if (!response.ok) {
      throw new OpenAIReviewError(
        `OpenAI API request failed (${response.status})`,
        { status: response.status, url, responseBody },
      );
    }

    let payload;
    try {
      payload = JSON.parse(responseBody);
    } catch {
      throw new OpenAIReviewError("OpenAI API returned invalid JSON", {
        status: response.status,
        url,
        responseBody,
      });
    }

    const markdown = extractOutputText(payload);
    if (!markdown) {
      throw new OpenAIReviewError("OpenAI API returned no output text", {
        status: response.status,
        url,
        responseBody,
      });
    }
    return { markdown, model };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new OpenAIReviewError(`OpenAI API request timed out after ${timeoutMs}ms`, { url });
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  API_ROOT,
  OpenAIReviewError,
  extractOutputText,
  requestOpenAIReview,
};
