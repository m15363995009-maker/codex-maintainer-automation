const OWNER_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const REPOSITORY_PATTERN = /^[A-Za-z0-9._-]+$/;

function normalizeRepository(value) {
  const repository = String(value || "").trim();
  const parts = repository.split("/");
  if (parts.length !== 2) {
    throw new Error(`Invalid repository allowlist entry: ${repository || "[empty]"}. Expected owner/repo`);
  }

  const [owner, name] = parts;
  const validOwner = OWNER_PATTERN.test(owner);
  const validName = name.length <= 100
    && name !== "."
    && name !== ".."
    && REPOSITORY_PATTERN.test(name);
  if (!validOwner || !validName) {
    throw new Error(`Invalid repository allowlist entry: ${repository}. Expected owner/repo`);
  }

  return `${owner}/${name}`.toLowerCase();
}

function isRepositoryAllowed(repository, allowRepositories = []) {
  if (!allowRepositories.length) return true;
  const normalized = normalizeRepository(repository);
  return allowRepositories.includes(normalized);
}

function assertRepositoryAllowed(repository, allowRepositories = []) {
  if (!isRepositoryAllowed(repository, allowRepositories)) {
    throw new Error(
      `Repository ${normalizeRepository(repository)} is not allowed. Add it with --allow-repo owner/repo`,
    );
  }
}

module.exports = {
  assertRepositoryAllowed,
  isRepositoryAllowed,
  normalizeRepository,
};
