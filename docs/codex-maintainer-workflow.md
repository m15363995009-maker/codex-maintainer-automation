# Codex-assisted maintainer workflow

This project uses Codex as a maintainer tool for repository audits, scoped implementation, test design, documentation alignment, and release preparation. Codex is advisory: the repository owner retains write access, reviews the diff and evidence, authorizes every publish step, and remains responsible for merge and release decisions.

The workflow is designed around the [Codex for Open Source](https://developers.openai.com/community/codex-for-oss) use cases of pull-request review, maintainer automation, and release workflows. This document records how those use cases are applied here; it is not evidence of OpenAI endorsement or program acceptance.

## Repeatable maintenance loop

1. Read the current public repository, open issues, pull requests, releases, and local worktree before choosing work.
2. Define a narrow maintainer problem and observable acceptance criteria.
3. Create a feature branch and keep unrelated worktree changes out of scope.
4. Use Codex to implement the change, add deterministic tests, and align user-facing documentation.
5. Run `npm ci --ignore-scripts`, `npm run check`, `npm pack --dry-run --json --ignore-scripts`, and `git diff --check`.
6. Have the repository owner explicitly authorize staging, commit, push, and pull-request creation.
7. Treat CI, the read-only pull-request report, and human review as merge gates.
8. Publish a release only after the merged commit and compatibility tags are verified, then update the evidence ledger from primary sources.

## Public maintenance cycles

| Maintainer problem | Public issue and change | Release or distribution result |
| --- | --- | --- |
| Restrict live review to approved repositories before network access | [Issue #4](https://github.com/m15363995009-maker/codex-maintainer-automation/issues/4) and [PR #5](https://github.com/m15363995009-maker/codex-maintainer-automation/pull/5) | [v0.1.0](https://github.com/m15363995009-maker/codex-maintainer-automation/releases/tag/v0.1.0) |
| Close a generated-review decision-heading validation bypass | [Issue #8](https://github.com/m15363995009-maker/codex-maintainer-automation/issues/8) and [PR #9](https://github.com/m15363995009-maker/codex-maintainer-automation/pull/9) | [v0.1.1](https://github.com/m15363995009-maker/codex-maintainer-automation/releases/tag/v0.1.1) |
| Retrieve changed-file metadata beyond GitHub's first 100-file page | [Issue #11](https://github.com/m15363995009-maker/codex-maintainer-automation/issues/11) and [PR #13](https://github.com/m15363995009-maker/codex-maintainer-automation/pull/13) | [v0.2.0](https://github.com/m15363995009-maker/codex-maintainer-automation/releases/tag/v0.2.0) |
| Provide a checkout-free, read-only GitHub Action and offline demo | [PR #21](https://github.com/m15363995009-maker/codex-maintainer-automation/pull/21) | [v0.3.0](https://github.com/m15363995009-maker/codex-maintainer-automation/releases/tag/v0.3.0) and the [Marketplace listing](https://github.com/marketplace/actions/codex-maintainer-pr-review) |
| Expose stable machine-readable review output | [Issue #14](https://github.com/m15363995009-maker/codex-maintainer-automation/issues/14) and [PR #22](https://github.com/m15363995009-maker/codex-maintainer-automation/pull/22) | [v0.4.0](https://github.com/m15363995009-maker/codex-maintainer-automation/releases/tag/v0.4.0) |

These links verify the resulting issues, code changes, checks, and releases. They do not identify which model authored individual lines, and repository activity is not presented as independent adoption.

## Codex and human responsibilities

| Codex assists with | The human maintainer controls |
| --- | --- |
| Baseline inspection and gap analysis | Project intent and prioritization |
| Scoped code, tests, and documentation changes | Identity, account, contact, and application fields |
| Reproducible verification commands | Staging, commit, push, PR, merge, tags, and releases |
| Diff, safety-boundary, and evidence review | Final security, legal, and ecosystem-impact claims |
| Draft release and application evidence | Submission and acceptance decisions |

## Safety and evidence boundaries

- Contributor-controlled code is not executed by the review workflow.
- The default heuristic engine needs no OpenAI key and the Action uses read-only GitHub permissions.
- Secrets, private diffs, personal data, and private project instructions are not committed as evidence.
- Stars, downloads, users, and external pilots are recorded only from dated primary sources.
- Same-owner or alternate-account tests remain self-tests and are not counted as independent adoption.
- A green test suite proves the checked behavior, not ecosystem importance, external usage, or acceptance into an OpenAI program.

## Evidence still needed

The strongest remaining gap is independent usage. The public [pilot invitation](https://github.com/m15363995009-maker/codex-maintainer-automation/issues/16) accepts successful, failed, and negative reports without requiring a Star. Verifiable third-party repositories, maintainer feedback, and organic Stars should be added to the evidence ledger only after they exist.
