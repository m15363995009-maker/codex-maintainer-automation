const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { resolvePullRequestUrl, runAction, safeOutputValue } = require("../action");

test("resolves the current pull request without trusting contributor code", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "codex-action-event-"));
  const eventPath = path.join(directory, "event.json");
  await fs.writeFile(eventPath, JSON.stringify({ pull_request: { number: 42 } }), "utf8");
  const url = await resolvePullRequestUrl({
    GITHUB_REPOSITORY: "example/project",
    GITHUB_EVENT_PATH: eventPath,
  });
  assert.equal(url, "https://github.com/example/project/pull/42");
});

test("requires an explicit URL for non-pull-request events", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "codex-action-event-"));
  const eventPath = path.join(directory, "event.json");
  await fs.writeFile(eventPath, JSON.stringify({ issue: { number: 42 } }), "utf8");
  await assert.rejects(
    resolvePullRequestUrl({ GITHUB_REPOSITORY: "example/project", GITHUB_EVENT_PATH: eventPath }),
    /does not contain a pull request number/,
  );
});

test("runs the CLI in read-only mode and publishes safe workflow outputs", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "codex-action-run-"));
  const summaryPath = path.join(directory, "summary.md");
  const workflowOutputPath = path.join(directory, "output.txt");
  const requestedReportPath = path.join(directory, "review.md");
  let invocation;
  const result = await runAction({
    env: {
      GITHUB_REPOSITORY: "example/project",
      GITHUB_STEP_SUMMARY: summaryPath,
      GITHUB_OUTPUT: workflowOutputPath,
      INPUT_PR_URL: "https://github.com/example/project/pull/7",
      INPUT_MODE: "heuristic",
      INPUT_OUTPUT_FILE: requestedReportPath,
      INPUT_GITHUB_TOKEN: "test-token",
    },
    mainImpl: async (options) => {
      invocation = options;
      options.stdout.write("## Summary of changes\nRead-only report\n");
      return { action: "reviewed", engine: "heuristic" };
    },
  });

  assert.deepEqual(invocation.argv, [
    "--pr", "https://github.com/example/project/pull/7",
    "--allow-repo", "example/project",
    "--mode", "heuristic",
    "--dry-run",
    "--out", path.resolve(requestedReportPath),
  ]);
  assert.equal(invocation.env.GITHUB_TOKEN, "test-token");
  assert.match(await fs.readFile(summaryPath, "utf8"), /Read-only report/);
  assert.match(await fs.readFile(workflowOutputPath, "utf8"), /engine=heuristic/);
  assert.equal(result.engine, "heuristic");
});

test("removes line breaks from workflow output values", () => {
  assert.equal(safeOutputValue("safe\nunsafe=value"), "safeunsafe=value");
});
