const SECRET_PATTERNS = [
  /\bghp_[A-Za-z0-9_]{20,}\b/g,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g,
  /\bsk-[A-Za-z0-9_-]{16,}\b/g,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  /\b(?:OPENAI|GITHUB)_API_KEY\s*[=:]\s*["']?[A-Za-z0-9_\-]{12,}["']?/gi,
];

function redactSecretLikeText(value) {
  let result = String(value || "");
  for (const pattern of SECRET_PATTERNS) {
    result = result.replace(pattern, "[REDACTED_SECRET]");
  }
  return result;
}

function containsSecretLikeText(value) {
  const text = String(value || "");
  return SECRET_PATTERNS.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
}

function pullRequestContainsSecretLikeText(pr) {
  const values = [pr?.title, pr?.body, pr?.diff, ...(pr?.files || []).map((file) => file.filename)];
  return values.some(containsSecretLikeText);
}

module.exports = {
  containsSecretLikeText,
  pullRequestContainsSecretLikeText,
  redactSecretLikeText,
};
