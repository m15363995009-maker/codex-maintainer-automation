#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");
const packageJson = require("../package.json");
const { assertRepositoryAllowed, normalizeRepository } = require("../src/allowlist");
const { fetchPullRequest, parsePullRequestUrl } = require("../src/github");
const { buildCommentBody, upsertReviewComment } = require("../src/comment");
const { buildJsonReport, formatJsonReport } = require("../src/json-report");
const { formatReview, reviewPullRequest } = require("../src/review");

function printHelp() {
  console.log(`Usage: codex-maintainer --pr https://github.com/owner/repo/pull/123 [options]

Options:
  --pr <url>                    Read a live GitHub pull request
  --allow-repo <owner/repo>     Allow a repository. Repeat for multiple repositories
  --fixture <file>              Read a local synthetic pull request fixture
  --demo                        Run the bundled synthetic pull request demo
  --mode auto|openai|heuristic  Review engine. Default: auto
  --out <file>                  Write the selected output format to a file
  --json                        Emit stable schema-versioned JSON instead of Markdown
  --json-out <file>             Also write schema-versioned JSON while keeping Markdown output
  --post-comment                Create or update one marked PR comment
  --dry-run                     Explicitly disable all GitHub writes
  --version                     Print the package version
  --help                        Show this help

Environment:
  GITHUB_TOKEN or GH_TOKEN      GitHub API token for API limits and comments
  OPENAI_API_KEY                Optional key for OpenAI mode
  OPENAI_MODEL                  Optional Responses API model override
`);
}

function requiredValue(argv, index, flag) {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
  return value;
}

function parseArgs(argv) {
  const options = {
    mode: "auto",
    postComment: false,
    dryRun: false,
    json: false,
    allowRepos: [],
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--version") options.version = true;
    else if (arg === "--pr") { options.pr = requiredValue(argv, index, "--pr"); index += 1; }
    else if (arg === "--allow-repo") {
      const repository = normalizeRepository(requiredValue(argv, index, "--allow-repo"));
      if (!options.allowRepos.includes(repository)) options.allowRepos.push(repository);
      index += 1;
    }
    else if (arg === "--fixture") { options.fixture = requiredValue(argv, index, "--fixture"); index += 1; }
    else if (arg === "--demo") options.demo = true;
    else if (arg === "--mode") { options.mode = requiredValue(argv, index, "--mode"); index += 1; }
    else if (arg === "--out") { options.out = requiredValue(argv, index, "--out"); index += 1; }
    else if (arg === "--json") options.json = true;
    else if (arg === "--json-out") { options.jsonOut = requiredValue(argv, index, "--json-out"); index += 1; }
    else if (arg === "--post-comment") options.postComment = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!["auto", "openai", "heuristic"].includes(options.mode)) {
    throw new Error("--mode must be one of: auto, openai, heuristic");
  }
  if ([options.pr, options.fixture, options.demo].filter(Boolean).length > 1) {
    throw new Error("--pr, --fixture, and --demo cannot be used together");
  }
  if (options.postComment && options.dryRun) {
    throw new Error("--post-comment and --dry-run cannot be used together");
  }
  if (options.json && options.jsonOut) {
    throw new Error("--json-out cannot be combined with --json; use --out for JSON-only output");
  }
  if (options.postComment && (options.fixture || options.demo)) throw new Error("--post-comment requires a live --pr");
  return options;
}

async function main({
  argv = process.argv.slice(2),
  env = process.env,
  fetchImpl = globalThis.fetch,
  stdout = process.stdout,
} = {}) {
  const options = parseArgs(argv);
  if (options.out && options.jsonOut && path.resolve(options.out) === path.resolve(options.jsonOut)) {
    throw new Error("--out and --json-out must resolve to different files");
  }
  if (options.help) { printHelp(); return { action: "help" }; }
  if (options.version) { stdout.write(`${packageJson.version}\n`); return { action: "version" }; }
  if (!options.pr && !options.fixture && !options.demo) {
    throw new Error("Provide --pr https://github.com/owner/repo/pull/123, --fixture <file>, or --demo");
  }

  if (options.pr) {
    const identity = parsePullRequestUrl(options.pr);
    assertRepositoryAllowed(`${identity.owner}/${identity.repo}`, options.allowRepos);
  }

  const token = env.GITHUB_TOKEN || env.GH_TOKEN || "";
  if (options.postComment && !token) throw new Error("--post-comment requires GITHUB_TOKEN or GH_TOKEN");

  let pullRequest;
  if (options.fixture || options.demo) {
    const fixturePath = options.demo
      ? path.resolve(__dirname, "..", "fixtures", "sample-pr.json")
      : path.resolve(options.fixture);
    pullRequest = JSON.parse(await fs.readFile(fixturePath, "utf8"));
  } else {
    pullRequest = await fetchPullRequest(options.pr, { token, fetchImpl });
  }
  const result = await reviewPullRequest(pullRequest, {
    mode: options.mode,
    apiKey: env.OPENAI_API_KEY,
    model: env.OPENAI_MODEL,
    fetchImpl,
  });
  const markdownOutput = formatReview(result.markdown, result.engine, result.warning);
  const jsonOutput = options.json || options.jsonOut
    ? formatJsonReport(buildJsonReport(pullRequest, result, { version: packageJson.version }))
    : "";
  const output = options.json ? jsonOutput : markdownOutput;

  if (options.out) {
    const destination = path.resolve(options.out);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, output, "utf8");
  }
  if (options.jsonOut) {
    const jsonDestination = path.resolve(options.jsonOut);
    await fs.mkdir(path.dirname(jsonDestination), { recursive: true });
    await fs.writeFile(jsonDestination, jsonOutput, "utf8");
  }
  if (options.postComment) {
    const commentBody = buildCommentBody(result.markdown, result.engine, result.warning);
    await upsertReviewComment(pullRequest, commentBody, { token, fetchImpl });
  }

  stdout.write(output);
  return { action: options.postComment ? "commented" : "reviewed", engine: result.engine };
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`codex-maintainer: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { main, parseArgs, printHelp };
