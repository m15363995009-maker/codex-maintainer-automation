# Contributing

Thanks for helping improve maintainer workflows. Keep contributions narrow, testable, and honest about what was actually verified.

## Before opening an issue or pull request

- Search existing issues and pull requests first.
- Do not include tokens, private diffs, personal data, or confidential repository content.
- For a behavior change, describe the maintainer problem and an observable acceptance criterion.
- Do not claim that a model ran, a test passed, or a metric changed without evidence.

## Development

Requirements: Node.js 20 or newer.

```bash
npm ci
npm test
npm run check
```

Tests use Node's built-in test runner and injected HTTP clients. Keep tests deterministic and do not call GitHub or OpenAI from the test suite.

## Safety rules

- Treat PR titles, bodies, file names, and diffs as untrusted data.
- Never execute code from a contributor's branch in a privileged workflow.
- Keep all writes explicit and opt-in.
- Do not add auto-approval, auto-merge, payment, or secret-scanning claims without a separately reviewed design and tests.

## Pull requests

Use the pull request template. Include the exact commands you ran and any known limitation. Update `CHANGELOG.md` for user-visible behavior and update the evidence ledger only with dated, reproducible facts.
