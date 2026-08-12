const fs = require("node:fs/promises");
const path = require("node:path");
const { main: cliMain } = require("../bin/codex-maintainer");

function readInput(env, name) {
  return String(env[`INPUT_${name.toUpperCase()}`] || "").trim();
}

async function resolvePullRequestUrl(env, fsImpl = fs) {
  const explicitUrl = readInput(env, "pr_url");
  if (explicitUrl) return explicitUrl;

  const repository = String(env.GITHUB_REPOSITORY || "").trim();
  const eventPath = String(env.GITHUB_EVENT_PATH || "").trim();
  if (!repository || !eventPath) {
    throw new Error("pr_url is required outside a GitHub pull_request workflow");
  }

  const event = JSON.parse(await fsImpl.readFile(eventPath, "utf8"));
  const number = event.pull_request?.number;
  if (!Number.isInteger(number) || number < 1) {
    throw new Error("The workflow event does not contain a pull request number; provide pr_url");
  }
  return `https://github.com/${repository}/pull/${number}`;
}

function safeOutputValue(value) {
  return String(value).replace(/[\r\n]/g, "");
}

async function appendWorkflowOutputs(outputPath, values, fsImpl = fs) {
  if (!outputPath) return;
  const body = Object.entries(values)
    .map(([key, value]) => `${key}=${safeOutputValue(value)}`)
    .join("\n");
  await fsImpl.appendFile(outputPath, `${body}\n`, "utf8");
}

async function runAction({ env = process.env, fsImpl = fs, mainImpl = cliMain } = {}) {
  const repository = String(env.GITHUB_REPOSITORY || "").trim();
  if (!repository) throw new Error("GITHUB_REPOSITORY is required");

  const prUrl = await resolvePullRequestUrl(env, fsImpl);
  const mode = readInput(env, "mode") || "heuristic";
  const outputFile = path.resolve(readInput(env, "output_file") || "codex-maintainer-review.md");
  const actionEnv = {
    ...env,
    GITHUB_TOKEN: readInput(env, "github_token") || env.GITHUB_TOKEN || "",
    OPENAI_API_KEY: readInput(env, "openai_api_key") || env.OPENAI_API_KEY || "",
  };
  let report = "";

  const result = await mainImpl({
    argv: [
      "--pr", prUrl,
      "--allow-repo", repository,
      "--mode", mode,
      "--dry-run",
      "--out", outputFile,
    ],
    env: actionEnv,
    stdout: { write(value) { report += String(value); } },
  });

  if (!report.trim()) throw new Error("The review completed without a Markdown report");
  if (env.GITHUB_STEP_SUMMARY) {
    await fsImpl.appendFile(env.GITHUB_STEP_SUMMARY, report, "utf8");
  }
  await appendWorkflowOutputs(env.GITHUB_OUTPUT, {
    review_file: outputFile,
    engine: result.engine,
  }, fsImpl);

  return { ...result, reviewFile: outputFile, report };
}

if (require.main === module) {
  runAction().catch((error) => {
    console.error(`codex-maintainer action: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  appendWorkflowOutputs,
  readInput,
  resolvePullRequestUrl,
  runAction,
  safeOutputValue,
};
