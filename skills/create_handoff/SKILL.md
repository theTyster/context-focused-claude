---
name: create_handoff
description: Use when creating handoff document for transferring work to another session
---

# Create Handoff

You are tasked with writing a handoff document to hand off your work to another agent in a new session. You will create a handoff document that is thorough, but also **concise**. The goal is to compact and summarize your context without losing any of the key details of what you're working on.


## Process
### 1. Filepath & Metadata
Use the following information to understand how to create your document:
    - create your file under `thoughts/handoffs/YYYY-MM-DD_HH-MM-SS_description.md`, where:
        - YYYY-MM-DD is today's date
        - HH-MM-SS is the hours, minutes and seconds based on the current time, in 24-hour format (i.e. use `13:00` for `1:00 pm`)
        - description is a brief kebab-case description
    - Generate metadata inline:
        - current_date: Use current date/time in ISO format with timezone
        - git_commit: Run `git rev-parse HEAD 2>/dev/null || echo "N/A (not in git repository)"`
        - branch: Run `git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "N/A"`
        - repository: Run `basename "$(git rev-parse --show-toplevel 2>/dev/null)" || basename "$PWD"`
    - Examples:
        - `2025-01-08_13-55-22_create-context-compaction.md`
        - `2025-01-08_13-55-22_implement-handoff-system.md`

### 2. Handoff writing.
Using the above conventions, compose your document in your context using the defined filepath, and the following YAML frontmatter pattern. Use the metadata gathered in step 1. Structure the document with YAML frontmatter followed by content.

Once composed, delegate the write to `thoughts_writer`:
```
Task tool with subagent_type: thoughts_writer
```
Pass the target file path and the composed content wrapped in `<content>` tags.

Use the following template structure:
```markdown
---
status: incomplete
type: handoff
topic: "{very concise description}"
---

# Handoff: {very concise description}

## Task(s)
{description of the task(s) that you were working on, along with the status of each (completed, work in progress, planned/discussed). If you are working on an implementation plan, make sure to call out which phase you are on. Make sure to reference the plan document and/or research document(s) you are working from that were provided to you at the beginning of the session, if applicable.}

## Critical References
{List any critical specification documents, architectural decisions, or design docs that must be followed. Include only 2-3 most important file paths. Leave blank if none.}

## Learnings
{describe important things that you learned - e.g. patterns, root causes of bugs, or other important pieces of information someone that is picking up your work after you should know. consider listing explicit file paths.}

## Action Items & Next Steps
{ a list of action items and next steps for the next agent to accomplish based on your tasks and their statuses}

## Recent Changes
{describe recent changes made to the codebase that you made in file:line syntax}

## Artifacts
{ an exhaustive list of artifacts you produced or updated as filepaths and/or file:line references - e.g. paths to feature documents, implementation plans, etc that should be read in order to resume your work.}

## Metadata
- Date: [Current date and time with timezone]
- Git: [Current commit hash] ([branch name])
- Repository: [Repository name]
- Tags: [handoff, relevant-component-names]
```
---

### 3. Approve and Sync
Once this is completed, you should respond to the user with the template between <template_response></template_response> XML tags. do NOT include the tags in your response.

<template_response>
Handoff created! You can resume from this handoff in a new session with the following command:

```bash
/resume_handoff path/to/handoff.md
```
</template_response>

for example (between <example_response></example_response> XML tags - do NOT include these tags in your actual response to the user)

<example_response>
Handoff created and synced! You can resume from this handoff in a new session with the following command:

```bash
/resume_handoff thoughts/handoffs/2025-01-08_13-44-55_create-context-compaction.md
```
</example_response>

---
##.  Additional Notes & Instructions
- **more information, not less**. This is a guideline that defines the minimum of what a handoff should be. Always feel free to include more information if necessary.
- **be thorough and precise**. include both top-level objectives, and lower-level details as necessary.
- **avoid excessive code snippets**. While a brief snippet to describe some key change is important, avoid large code blocks or diffs; do not include one unless it's necessary (e.g. pertains to an error you're debugging). Prefer using `/path/to/file.ext:line` references that an agent can follow later when it's ready, e.g. `packages/dashboard/src/app/dashboard/page.tsx:12-24`
