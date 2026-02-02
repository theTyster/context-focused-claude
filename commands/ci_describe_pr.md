---
description: Generate comprehensive Pull Request templates following repository templates
---

# Generate PR Description

You are tasked with generating a comprehensive pull request template following the repository's standard template.

## Steps to follow:

1. **Use standard PR description structure:**
   - Use a standard PR template format with sections: Summary, Changes, Testing, Breaking Changes
   - If a custom template exists at `thoughts/pr_descriptions/template.md`, use that instead

2. **Identify the PR to describe:**
   - Get current commit hash: `git rev-parse HEAD`
   - Get current commit message: `git log -1 --pretty=%B`
   - If user wants to describe a different commit, ask them to provide the commit hash or reference (e.g., `HEAD~3`, `main`, tag name)
   - Validate the commit exists: `git cat-file -t <commit>`

3. **Check for existing description:**
   - Generate filename: `{COMMIT_HASH} - {COMMIT_MESSAGE_FIRST_LINE}.md`
   - Check if `thoughts/pr_descriptions/{filename}` already exists
   - If it exists, read it and inform the user you'll be updating it
   - Consider what has changed since the last description was written

4. **Gather comprehensive PR information:**
   - Get the full commit diff: `git show {commit}`
   - Get commit metadata: `git log -1 --pretty=format:"%H%n%an%n%ae%n%ai%n%B" {commit}`
   - Get files changed: `git diff-tree --no-commit-id --name-only -r {commit}`
   - Get commit statistics: `git diff-tree --no-commit-id --stat -r {commit}`
   - Get parent commits: `git rev-parse {commit}^@`
   - Identify the base branch by checking merge-base: `git merge-base {commit} main` or similar

5. **Analyze the changes thoroughly:** (ultrathink about the code changes, their architectural implications, and potential impacts)
   - Read through the entire diff carefully
   - For context, read any files that are referenced but not shown in the diff using `git show {commit}:{filepath}`
   - Understand the purpose and impact of each change
   - Identify user-facing changes vs internal implementation details
   - Look for breaking changes or migration requirements
   - Analyze the scope: does this affect one file, one component, or multiple systems?

6. **Handle verification requirements:**
   - Look for any checklist items in the "How to verify it" section of the template
   - For each verification step:
     - If it's a command you can run (like `make check test`, `npm test`, etc.), run it in the context of this commit
     - If it passes, mark the checkbox as checked: `- [x]`
     - If it fails, keep it unchecked and note what failed: `- [ ]` with explanation
     - If it requires manual testing (UI interactions, external services), leave unchecked and note for user
   - Document any verification steps you couldn't complete

7. **Generate the description:**
   - Fill out each section from the template thoroughly:
     - Answer each question/section based on your analysis
     - Be specific about problems solved and changes made
     - Focus on user impact where relevant
     - Include technical details in appropriate sections
     - Write a concise changelog entry
   - Ensure all checklist items are addressed (checked or explained)
   - Include commit metadata:
     - Commit hash
     - Commit date
     - Files changed summary

8. **Save the description:**
   - Write the completed description to `thoughts/pr_descriptions/{COMMIT_HASH} - {COMMIT_MESSAGE}.md`
   - Show the user the generated description and file path

## Important notes:
- This command works across different repositories - always read the local template
- Be thorough but concise - descriptions should be scan-able
- Focus on the "why" as much as the "what"
- Include any breaking changes or migration notes prominently
- If the PR touches multiple components, organize the description accordingly
- Always attempt to run verification commands when possible
- Clearly communicate which verification steps need manual testing
- Store descriptions locally in the `thoughts/pr_descriptions/` directory for offline access and version control
- Filename format: `{COMMIT_HASH} - {COMMIT_MESSAGE}.md` ensures uniqueness and readability
- Use git commands exclusively - no external tools required beyond basic git
