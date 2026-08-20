# GitHub Marketplace quickstart

`Codex Maintainer PR Review` is a read-only JavaScript action. It retrieves pull request metadata and changed-file content through GitHub's API, runs the deterministic heuristic reviewer by default, and writes the report to the workflow summary and a Markdown file. It never checks out or executes contributor-controlled code.

[View the published `v0.4.0` Action on GitHub Marketplace](https://github.com/marketplace/actions/codex-maintainer-pr-review).

## Install

Create `.github/workflows/codex-maintainer-review.yml` in the repository you want to review:

```yaml
name: Codex maintainer review

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: read

jobs:
  review:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Generate read-only PR review
        id: review
        uses: m15363995009-maker/codex-maintainer-automation@v0
        with:
          github_token: ${{ github.token }}

      - name: Upload both review reports
        uses: actions/upload-artifact@v7
        with:
          name: codex-maintainer-review-${{ github.event.pull_request.number }}
          path: |
            ${{ steps.review.outputs.review_file }}
            ${{ steps.review.outputs.json_file }}
          if-no-files-found: error
```

No checkout or dependency-install step is required. Open the workflow run's summary to read the Markdown report, or download both reports for dashboards and follow-on automation.

## Inputs

| Input | Default | Purpose |
| --- | --- | --- |
| `github_token` | empty | Read private repositories and avoid anonymous API limits. `${{ github.token }}` with read-only permissions is recommended. |
| `pr_url` | triggering PR | Review a specific public GitHub pull request URL. Required outside a `pull_request` event. |
| `mode` | `heuristic` | Select `heuristic`, `auto`, or `openai`. |
| `openai_api_key` | empty | Optional secret for `auto` or `openai`; never needed for `heuristic`. |
| `output_file` | `codex-maintainer-review.md` | Choose the Markdown report path. |
| `json_output_file` | `codex-maintainer-review.json` | Choose the schema-versioned JSON report path. |

## Outputs

| Output | Purpose |
| --- | --- |
| `review_file` | Absolute path to the human-readable Markdown report. |
| `json_file` | Absolute path to the schema-versioned JSON report. |
| `engine` | Review engine that produced both reports. |

Both files come from one pull-request retrieval and one review pass. The JSON object omits the raw diff and pull-request body.

## Security boundary

- The action always supplies the CLI's `--dry-run` flag.
- The triggering repository is enforced with `--allow-repo` before any API request.
- The default engine is deterministic and uses no third-party model API.
- Pull request titles, bodies, and diffs are untrusted input; they are not commands.
- The report is advisory. A human maintainer remains responsible for approvals, merges, and releases.

For optional OpenAI mode, pass a repository secret and keep permissions read-only:

```yaml
with:
  github_token: ${{ github.token }}
  mode: openai
  openai_api_key: ${{ secrets.OPENAI_API_KEY }}
```

Do not use `pull_request_target` with untrusted workflow changes unless you understand GitHub's security model. This action does not need that trigger.

## Try the same engine locally

After the npm release, run the bundled synthetic demo from any directory:

```bash
npx codex-maintainer-automation@0.5.0 --demo --mode heuristic --dry-run --json
```
