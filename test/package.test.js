const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const test = require("node:test");

const packageJson = require("../package.json");

test("package publishes the stable codex-maintainer executable", async () => {
  assert.deepEqual(packageJson.bin, {
    "codex-maintainer": "bin/codex-maintainer.js",
  });

  const executable = await fs.readFile(
    path.join(__dirname, "..", packageJson.bin["codex-maintainer"]),
    "utf8",
  );
  assert.match(executable, /^#!\/usr\/bin\/env node\r?\n/);
});
