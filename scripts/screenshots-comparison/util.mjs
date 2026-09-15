export const parseTargetBranch = targetBranchValue => {
  const targetBranch = targetBranchValue?.trim();
  if (!targetBranch) {
    throw new Error('Missing required --target-branch argument. Example: --target-branch master');
  }

  return targetBranch;
};

export const getWorkTreeRelativePath = targetBranchValue => {
  const targetBranch = parseTargetBranch(targetBranchValue);
  const sanitizedTargetBranch = targetBranch.replace(/[^a-zA-Z0-9._-]/g, '_');
  const worktreeName = `${sanitizedTargetBranch}-origin`;
  return `.tmp/worktree/${worktreeName}`;
};
