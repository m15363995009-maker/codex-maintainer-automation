# Changelog

## [0.5.0] - 2026-08-20

- generate human-readable Markdown and schema-versioned JSON from one review with `--json-out`;
- expose both report paths as GitHub Action outputs for summaries, artifacts, dashboards, and follow-on jobs;
- reject colliding Markdown and JSON output paths before pull-request retrieval;
- refocus the README on the maintainer problem, a 30-second Action install, and a real deterministic sample.
- publish a source-linked Codex-assisted maintenance workflow with explicit human and evidence boundaries.

## [0.4.0] - 2026-08-17

- add a stable, schema-versioned `--json` output mode for dashboards and automation consumers;
- include normalized pull-request metadata, files, review sections, confidence, engine, and warnings while omitting the raw diff and pull-request body;
- add regression coverage for JSON parsing, schema versioning, and the bundled offline demo.

## [0.3.0] - 2026-08-12

- added a dependency-free, Marketplace-compatible JavaScript action that generates a read-only PR review in the workflow summary;
- enforced the triggering repository allowlist and dry-run mode inside the action wrapper;
- added action-event and workflow-output regression coverage;
- added a copyable Marketplace quickstart with least-privilege permissions;
- completed npm discovery metadata and public-package configuration;
- added a repository social-preview asset for clearer discovery.

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
