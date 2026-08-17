const { redactSecretLikeText } = require("./sanitize");

const JSON_SCHEMA_VERSION = "1";
const SECTION_HEADINGS = [
  "## Summary of changes",
  "## Identified risks",
  "## Improvement suggestions",
  "## Confidence score",
];

function sectionText(markdown, heading) {
  const start = markdown.indexOf(heading);
  if (start === -1) return "";
  const contentStart = start + heading.length;
  const nextHeading = SECTION_HEADINGS
    .map((candidate) => markdown.indexOf(candidate, contentStart))
    .filter((index) => index !== -1)
    .sort((left, right) => left - right)[0];
  return markdown.slice(contentStart, nextHeading === undefined ? markdown.length : nextHeading).trim();
}

function bulletItems(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

function confidenceValue(value) {
  const match = value.match(/^(Low|Medium|High)\s*(?:-|\u2013|\u2014)\s*(.*)$/is);
  return match
    ? { level: match[1], reason: match[2].trim() }
    : { level: "Unknown", reason: value.trim() };
}

function buildJsonReport(pr, result, { version = "" } = {}) {
  const markdown = redactSecretLikeText(String(result.markdown || "").trimEnd());
  const repository = pr.owner && pr.repo ? `${pr.owner}/${pr.repo}` : null;
  return {
    schemaVersion: JSON_SCHEMA_VERSION,
    generator: {
      name: "codex-maintainer-automation",
      version,
    },
    source: {
      repository,
      pullRequestNumber: Number.isInteger(pr.number) ? pr.number : null,
      url: pr.htmlUrl || null,
    },
    engine: result.engine,
    model: result.model || null,
    warning: result.warning || null,
    pullRequest: {
      title: redactSecretLikeText(pr.title || ""),
      author: redactSecretLikeText(pr.author || "unknown"),
      baseRef: redactSecretLikeText(pr.baseRef || ""),
      headRef: redactSecretLikeText(pr.headRef || ""),
      changedFiles: Number(pr.changedFiles || 0),
      additions: Number(pr.additions || 0),
      deletions: Number(pr.deletions || 0),
      files: (pr.files || []).map((file) => ({
        filename: redactSecretLikeText(file.filename || ""),
        status: file.status || "modified",
        additions: Number(file.additions || 0),
        deletions: Number(file.deletions || 0),
        changes: Number(file.changes || 0),
      })),
    },
    review: {
      summary: sectionText(markdown, "## Summary of changes"),
      risks: bulletItems(sectionText(markdown, "## Identified risks")),
      suggestions: bulletItems(sectionText(markdown, "## Improvement suggestions")),
      confidence: confidenceValue(sectionText(markdown, "## Confidence score")),
      markdown,
    },
  };
}

function formatJsonReport(report) {
  return `${JSON.stringify(report, null, 2)}\n`;
}

module.exports = {
  JSON_SCHEMA_VERSION,
  buildJsonReport,
  confidenceValue,
  formatJsonReport,
  sectionText,
};
