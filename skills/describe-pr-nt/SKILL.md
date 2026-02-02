---
name: describe-pr-nt
description: Use when generating comprehensive PR descriptions following repository templates
---

# Generate PR Description

You are tasked with generating a comprehensive pull request description following the repository's standard template.

## Steps to follow:

1. **Read the PR description template:**

    - Use the following PR description template:

        ```md
        ## What problem(s) was I solving?

        ## What user-facing changes did I ship?

        ## How I implemented it

        ## How to verify it

        ### Manual Testing

        ## Description for the changelog
        ```

    - Read the template carefully to understand all sections and requirements

2. **Identify the branch to describe:**
   - Get current branch: `git rev-parse --abbrev-ref HEAD`
   - Verify branch is not main/master
   - Get branch tracking info: `git rev-parse --abbrev-ref @{upstream} 2>/dev/null || echo "No upstream"`

3. **Check for existing description:**
   - Generate filename from current date and branch: `thoughts/pr_descriptions/YYYY-MM-DD-branch-name.md`
   - Check if description already exists for this branch
   - If it exists, read it and inform the user you'll be updating it
   - Consider what has changed since the last description was written

4. **Gather comprehensive branch information:**
   - Get the full diff against main: `git diff origin/main...HEAD`
   - Get diff stats: `git diff origin/main...HEAD --stat`
   - Get commit history: `git log origin/main..HEAD --oneline`
   - Get detailed commit messages: `git log origin/main..HEAD --format='%h %s%n%b'`
   - Identify base branch (usually main/master): `git rev-parse --abbrev-ref HEAD@{upstream} | cut -d/ -f2 || echo "main"`

5. **Analyze the changes thoroughly:** (ultrathink about the code changes, their architectural implications, and potential impacts)
   - Read through the entire diff carefully
   - For context, read any files that are referenced but not shown in the diff
   - Understand the purpose and impact of each change
   - Identify user-facing changes vs internal implementation details
   - Look for breaking changes or migration requirements

6. **Handle verification requirements:**
   - Look for any checklist items in the "How to verify it" section of the template
   - For each verification step:
     - If it's a command you can run (like `make check test`, `npm test`, etc.), run it
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

8. **Save the description:**
   - Write the completed description to `thoughts/pr_descriptions/YYYY-MM-DD-branch-name.md`
   - Show the user the generated description
   - Inform user they can copy this to their PR description

9. **Next steps:**
   - Display the file path where the description was saved
   - Remind user to copy the description to their PR manually
   - If any verification steps remain unchecked, remind the user to complete them before merging

## Important notes:
- This command works across different repositories - always read the local template
- Be thorough but concise - descriptions should be scannable
- Focus on the "why" as much as the "what"
- Include any breaking changes or migration notes prominently
- If the PR touches multiple components, organize the description accordingly
- Always attempt to run verification commands when possible
- Clearly communicate which verification steps need manual testing
