# Security Scrubbing Skill

This skill provides a standardized workflow for identifying and removing sensitive information (passwords, tokens, keys) from Git history using `git filter-repo` and `gitleaks`.

## Guidelines

1. **Identification**: Always run `gitleaks detect -v` first to identify the scope of exposed secrets.
2. **Replacement Plan**: Create a mapping file (e.g., `expressions.txt`) using the format `old_value==>new_value`.
3. **Execution**: Use `git filter-repo --replace-text expressions.txt --force` to rewrite history.
4. **Verification**: Re-run `gitleaks` to ensure zero leaks remain.
5. **Synchronization**: Force-push to all remote remotes (`git push origin <branch> --force`). Update all collaborators.
6. **Archiving**: Log the operation in the project's Runbook directory with a timestamped record.

## Best Practices

- Always use descriptive placeholders like `YOUR_PASSWORD` or `MFA_SECRET_PLACEHOLDER`.
- Scan all branches, not just the active one, if secrets were historically committed elsewhere.
- Notify the team immediately after a force-push as it breaks local clones.
