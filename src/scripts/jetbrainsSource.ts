/**
 * The JetBrains/intellij-community commit the build scripts download from (`themes/jetbrains-source.json`, or the
 * latest commit of master from the GitHub API). It goes into the download URLs and the logs, so it must be a full
 * commit SHA: 40 lower case hex digits, nothing that could change the path of the URL or add a line to the log.
 */
const COMMIT_SHA = /^[\da-f]{40}$/;

export const checkedCommit = (commit: unknown): string => {
  if (typeof commit !== 'string' || !COMMIT_SHA.test(commit)) {
    throw new Error('jetbrains-source: the commit must be a full commit SHA (40 hex digits)');
  }
  return commit;
};
