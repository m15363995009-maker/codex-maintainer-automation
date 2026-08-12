# Sanitized project-lifecycle maintenance pilot

## Decision

A full project-lifecycle system is suitable as a maintenance target for `codex-maintainer-automation`, but its private source package is not suitable for direct publication inside this repository.

The public pilot therefore uses [`fixtures/project-lifecycle-pr.json`](../fixtures/project-lifecycle-pr.json), a synthetic pull request about a generic closure quality gate. It exercises the same class of maintainer decision: policy changes must be reviewed for state-transition risks, evidence requirements, test coverage, and documentation consistency.

## Publication boundary

The fixture contains no copied private instructions and no real:

- cloud-storage links or file identifiers;
- local filesystem paths;
- source filenames, checksums, or manifests;
- account, customer, or project identifiers;
- proprietary skill inventory or business content.

Only generic lifecycle concepts are represented. The fixture is safe to run offline and cannot write to a repository.

## Reproduce the pilot

```bash
npm ci
npm run test:lifecycle-fixture
```

The command creates a heuristic review on standard output. It does not call GitHub, an AI API, or a cloud-storage service.

## Evidence classification

This is a same-maintainer, sanitized applicability pilot. It is useful evidence of testable maintenance coverage, but it is not external adoption, a third-party endorsement, or a production deployment.

Onboarding a real public lifecycle repository later requires a separate repository URL, a privacy review, a repository allowlist entry, and a read-only dry run before any comment-posting permission is considered.
