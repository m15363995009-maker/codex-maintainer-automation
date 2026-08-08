# codex-maintainer-automation

`codex-maintainer-automation` is a small GitHub-native assistant for open-source maintainers. It turns a pull request's metadata and diff into one structured review packet: what changed, what may be risky, and what still needs human attention.

The default engine is deterministic and runs without an API key. An optional OpenAI Responses API engine can improve the wording and reasoning, but it does not change the safety boundary: the tool never approves, merges, labels, closes, pays, or executes contributor-controlled code.

## Current status

This repository is a bootstrap `v0.1.0` candidate. It has no claimed stars, downloads, users, contributors, dependents, or public pilot results yet. Those fields remain `not yet measured` until a dated source is recorded in [`docs/evidence-ledger.md`](docs/evidence-ledger.md).

The project is not an OpenAI product and is not evidence of acceptance into any OpenAI program. Any application must use accurate repository and maintainer information.

## What is included

- Node.js 20+ CLI: `codex-maintainer`.
- Strict GitHub pull request URL validation and API retrieval of metadata, files, and diff.
- Deterministic heuristic review for offline use and smoke testing.
- Optional OpenAI Responses API review through `OPENAI_API_KEY`.
- Stable Markdown headings and an idempotent, explicitly enabled comment path.
- Tests with injected HTTP clients; no pull-request code is executed.
- A read-only GitHub Action that runs the heuristic report from trusted base-branch code.

## Local use

```bash
npm ci
npm test
npm run check

node bin/codex-maintainer.js \
  --fixture fixtures/sample-pr.json \
  --mode heuristic \
  --dry-run

node bin/codex-maintainer.js \
  --pr https://github.com/owner/repository/pull/123 \
  --mode heuristic \
  --dry-run
```

To use the optional OpenAI engine, set `OPENAI_API_KEY` and choose `--mode openai`, or leave the default `--mode auto` so the CLI falls back to the heuristic engine when no key is configured or the API is unavailable.

```bash
OPENAI_API_KEY="..." \
node bin/codex-maintainer.js \
  --pr https://github.com/owner/repository/pull/123 \
  --mode openai \
  --out review.md
```

The API key is read only from the environment. Do not put it in the repository, an issue, a PR body, or a fixture. The adapter sends `store: false`; this is a client setting, not a promise about every organization or account retention policy.

To explicitly create or update the single marked PR comment, provide a GitHub token and use `--post-comment`. Read-only output is the default, and `--post-comment` cannot be combined with `--dry-run`.

## GitHub Action boundary

The included report workflow checks out only the base branch, reads the PR through GitHub's API, and runs the deterministic engine without a write-capable token or OpenAI secret. It is deliberately a report generator, not an auto-merge or auto-approval system. A maintainer can run the CLI manually when a comment is wanted.

Every PR review is advisory. Human maintainers remain responsible for tests, security decisions, approvals, merges, and releases.

## Evidence discipline

The repository records claims only when they have a dated source URL or command output. See [`docs/evidence-ledger.md`](docs/evidence-ledger.md) for the format. Empty or unknown fields are intentionally left unfilled; no project metric is inferred from repository creation.

## Project documents

- [`CONTRIBUTING.md`](CONTRIBUTING.md) — development and review rules.
- [`SECURITY.md`](SECURITY.md) — threat boundary and reporting path.
- [`docs/evidence-ledger.md`](docs/evidence-ledger.md) — factual usage and maintenance evidence.
- [`CHANGELOG.md`](CHANGELOG.md) — release history.

## License

MIT. See [`LICENSE`](LICENSE).
