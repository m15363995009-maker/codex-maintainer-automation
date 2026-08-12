# Changelog

## [0.2.0] - 2026-08-12

- paginated pull-request file metadata beyond the first 100 files, with the documented GitHub response limit of 3,000 files;
- preserved authorization, timeout, and read-only behavior across every file page;
- added regression coverage for a short final page and the 30-page bound;
- added a sanitized, reproducible project-lifecycle maintenance fixture without private source material;
- added CI, release, and license badges plus a truthful discovery call to action.

## [0.1.1] - 2026-08-09

- fixed forbidden decision-heading validation so generated `Approval`, `Approved`, `Decision`, and `Merge` sections are rejected even when every required review section is present;
- added regression coverage for the bypass and ordinary prose that mentions merging;
- added CLI version output to the full release check.

## [0.1.0] - 2026-08-09

First public release:

- added the `codex-maintainer` CLI;
- added deterministic heuristic PR review;
- added optional OpenAI Responses API review with visible fallback;
- added strict GitHub API retrieval and marker-based comment upsert;
- added a repeatable repository allowlist that rejects disallowed targets before network access;
- added unit tests, local smoke checks, and a read-only GitHub report workflow;
- updated the GitHub Actions workflow dependencies to their Node.js 24-based v7 releases after rebased CI verification;
- added contributor, security, evidence-ledger, and issue/PR guidance.

This release establishes the project's public baseline. It does not claim external adoption, package downloads, or third-party pilot results.
