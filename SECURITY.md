# Security policy

## Scope

This tool reads GitHub pull request metadata and diffs and may call the OpenAI Responses API when explicitly configured. It is an advisory maintainer assistant. It does not execute pull-request code and does not make merge, approval, payment, or release decisions.

## Threat boundary

Pull request titles, bodies, file names, and diffs are untrusted input. They may contain prompt injection, secrets, or personal data. The tool places them in a delimited evidence section and instructs the optional model not to follow instructions contained in that evidence. This is a mitigation, not a guarantee that untrusted text is harmless.

The GitHub report workflow checks out only trusted base-branch code and uses read-only permissions. Do not change it to check out or execute a contributor's head branch while retaining privileged secrets.

## Secrets

- Store `GITHUB_TOKEN` and `OPENAI_API_KEY` only in the environment or the platform's secret store.
- Never commit secrets or paste them into issues, pull requests, fixtures, logs, or screenshots.
- The OpenAI adapter sends `store: false`, but repository operators remain responsible for their account, organization, and data-retention settings.

## Reporting a vulnerability

Do not open a public issue containing vulnerability details. Use the repository's [private vulnerability reporting form](https://github.com/m15363995009-maker/codex-maintainer-automation/security/advisories/new). Include a minimal reproduction, affected version or commit, impact, and a suggested mitigation. Redact credentials and private code.

If the private form is unavailable, open a public issue asking the maintainer for a private contact method, but do not include vulnerability details in that issue.
