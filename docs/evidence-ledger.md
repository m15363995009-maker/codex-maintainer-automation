# Evidence ledger

This file is a factual record, not a marketing page. Add a row only after checking the source on the stated date. Do not estimate or copy values from an undated page.

| Claim | Value | Source URL or command | Checked on | Notes |
|---|---|---|---|---|
| Public repository | https://github.com/m15363995009-maker/codex-maintainer-automation | GitHub REST API `GET /repos/m15363995009-maker/codex-maintainer-automation` | 2026-08-09 | Public repository; default branch is `main`; verified after release-preparation commit `d0549ad`. |
| Maintainer role | repository owner metadata: `m15363995009-maker` | GitHub REST API repository owner field | 2026-08-09 | Confirms public owner metadata only; it is not evidence of external adoption. |
| Stars | 0 | GitHub REST API `GET /repos/m15363995009-maker/codex-maintainer-automation` | 2026-08-09 | Verified after the first release; do not substitute watchers or forks. |
| Monthly downloads | not yet measured | not yet recorded | not yet recorded | Only applicable if a package is published. |
| Public users or pilot repositories | not yet recorded | not yet recorded | not yet recorded | Record consented repositories and exact workflow/comment URLs. |
| Releases | 1 public release: `v0.1.0` | https://github.com/m15363995009-maker/codex-maintainer-automation/releases/tag/v0.1.0 | 2026-08-09 | Published as a non-draft, non-prerelease release targeting commit `d0549ad`. |
| Maintainer feature cycle | Issue #4 closed through merged PR #5 | [Issue #4](https://github.com/m15363995009-maker/codex-maintainer-automation/issues/4) and [PR #5](https://github.com/m15363995009-maker/codex-maintainer-automation/pull/5) | 2026-08-09 | Repository allowlist change; PR CI and read-only report passed before merge. This is maintainer work, not an external contribution. |
| Dependency maintenance | PRs #1, #2, and #3 merged after rebased checks | [PR #1](https://github.com/m15363995009-maker/codex-maintainer-automation/pull/1), [PR #2](https://github.com/m15363995009-maker/codex-maintainer-automation/pull/2), and [PR #3](https://github.com/m15363995009-maker/codex-maintainer-automation/pull/3) | 2026-08-09 | Updated upload-artifact, setup-node, and checkout to v7 sequentially; final combined main CI passed. |
| CI runs | release-preparation `main` CI passed | https://github.com/m15363995009-maker/codex-maintainer-automation/actions/runs/31295208119 | 2026-08-09 | Run for commit `d0549ad`; this proves workflow execution, not project adoption. |
| Maintainer self-pilot | live read-only dry-run against PR #5 | `node bin/codex-maintainer.js --pr https://github.com/m15363995009-maker/codex-maintainer-automation/pull/5 --allow-repo m15363995009-maker/codex-maintainer-automation --mode heuristic --dry-run` | 2026-08-09 | Successful self-test against this repository; it is not an external user or third-party pilot. |
| Contribution bounty | proposed; payment platform not configured | [`docs/contribution-bounty.md`](contribution-bounty.md) | 2026-08-08 | Not an active paid bounty; no payout or engagement promise is being claimed. |
| Maintainer feedback | not yet collected | not yet recorded | not yet recorded | State method and date when collected. |

Before using this ledger in an application, re-check every row and replace placeholders with primary, dated evidence. A missing value is preferable to a fabricated value.
