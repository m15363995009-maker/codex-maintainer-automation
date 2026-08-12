# codex-maintainer-automation

[![CI](https://github.com/m15363995009-maker/codex-maintainer-automation/actions/workflows/ci.yml/badge.svg)](https://github.com/m15363995009-maker/codex-maintainer-automation/actions/workflows/ci.yml)
[![Latest release](https://img.shields.io/github/v/release/m15363995009-maker/codex-maintainer-automation)](https://github.com/m15363995009-maker/codex-maintainer-automation/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

`codex-maintainer-automation` is a small GitHub-native assistant for open-source maintainers. It turns a pull request's metadata and diff into one structured review packet: what changed, what may be risky, and what still needs human attention.

The default engine is deterministic and runs without an API key. An optional OpenAI Responses API engine can improve the wording and reasoning, but it does not change the safety boundary: the tool never approves, merges, labels, closes, pays, or executes contributor-controlled code.

## Current status

Version `v0.2.0` retrieves file metadata across paginated GitHub responses, up to GitHub's documented 3,000-file limit. It also adds a sanitized project-lifecycle fixture that demonstrates review of workflow-policy changes without publishing private project material. The project has no claimed downloads, external users, dependents, or third-party pilot results yet; those fields remain `not yet measured` until a dated source is recorded in [`docs/evidence-ledger.md`](docs/evidence-ledger.md).

The CLI has one dated, public cross-project maintainer pilot on [`claude-builders-bounty` PR #6](https://github.com/m15363995009-maker/claude-builders-bounty/pull/6#issuecomment-5231633189). Both repositories have the same owner, so this is reproducible maintainer-workflow evidence, not external adoption.

The project is not an OpenAI product and is not evidence of acceptance into any OpenAI program. Any application must use accurate repository and maintainer information.

## What is included

- Node.js 20+ CLI: `codex-maintainer`.
- Strict GitHub pull request URL validation and API retrieval of metadata, files, and diff.
- Paginated changed-file retrieval for pull requests with more than 100 files, bounded at 30 pages.
- Repeatable repository allowlist enforcement before any GitHub API request.
- Deterministic heuristic review for offline use and smoke testing.
- Optional OpenAI Responses API review through `OPENAI_API_KEY`.
- Stable Markdown headings and an idempotent, explicitly enabled comment path.
- Tests with injected HTTP clients; no pull-request code is executed.
- A read-only GitHub Action that runs the heuristic report from trusted base-branch code.
- A sanitized project-lifecycle maintenance fixture with explicit privacy boundaries.

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
  --fixture fixtures/project-lifecycle-pr.json \
  --mode heuristic \
  --dry-run

node bin/codex-maintainer.js \
  --pr https://github.com/owner/repository/pull/123 \
  --allow-repo owner/repository \
  --mode heuristic \
  --dry-run
```

Use `--allow-repo owner/repository` to restrict live review to an approved repository. Repeat the flag to approve more than one repository. Matching is case-insensitive, invalid entries fail validation, and a disallowed target is rejected before the CLI makes a GitHub API request. Omitting the flag preserves the original unrestricted read behavior.

To use the optional OpenAI engine, set `OPENAI_API_KEY` and choose `--mode openai`, or leave the default `--mode auto` so the CLI falls back to the heuristic engine when no key is configured or the API is unavailable.

```bash
OPENAI_API_KEY="..." \
node bin/codex-maintainer.js \
  --pr https://github.com/owner/repository/pull/123 \
  --mode openai \
  --out review.md
```

The API key is read only from the environment. Do not put it in the repository, an issue, a PR body, or a fixture. The adapter sends `store: false`; this is a client setting, not a promise about every organization or account retention policy.

To explicitly create or update the single marked PR comment, provide a GitHub token and use `--post-comment`. Read-only output is the default, and `--post-comment` cannot be combined with `--dry-run`. For shared automation, pair `--post-comment` with `--allow-repo` so an unexpected URL cannot redirect the write to another repository.

## GitHub Action boundary

The included report workflow checks out only the base branch, reads the PR through GitHub's API, and runs the deterministic engine without a write-capable token or OpenAI secret. It is deliberately a report generator, not an auto-merge or auto-approval system. A maintainer can run the CLI manually when a comment is wanted.

Every PR review is advisory. Human maintainers remain responsible for tests, security decisions, approvals, merges, and releases.

## Project-lifecycle pilot

[`docs/project-lifecycle-pilot.md`](docs/project-lifecycle-pilot.md) records a sanitized same-maintainer pilot for policy-driven workflow projects. The repository contains only synthetic metadata and a synthetic diff; it does not include private Drive links, file IDs, local paths, source hashes, or the original lifecycle instructions. This proves a reproducible maintenance scenario, not external adoption.

## Evidence discipline

The repository records claims only when they have a dated source URL or command output. See [`docs/evidence-ledger.md`](docs/evidence-ledger.md) for the format. Empty or unknown fields are intentionally left unfilled; no project metric is inferred from repository creation.

## Contribution bounty plan

The project has a transparent, proposed contribution-bounty plan in [`docs/contribution-bounty.md`](docs/contribution-bounty.md). It is not an active paid bounty until an issue publishes the task, acceptance criteria, amount, funding source, and payout method. Stars and follows are never required for payment.

If the tool saves you review time, an authentic Star helps other maintainers discover it. For bugs or ideas, open a reproducible issue; no engagement action is required for support or contribution review.

## Project documents

- [`CONTRIBUTING.md`](CONTRIBUTING.md) — development and review rules.
- [`SECURITY.md`](SECURITY.md) — threat boundary and reporting path.
- [`docs/evidence-ledger.md`](docs/evidence-ledger.md) — factual usage and maintenance evidence.
- [`docs/contribution-bounty.md`](docs/contribution-bounty.md) — proposed contribution-bounty rules and evidence requirements.
- [`CHANGELOG.md`](CHANGELOG.md) — release history.

## License

MIT. See [`LICENSE`](LICENSE).
