---
name: create_handoff
description: Use when creating handoff document for transferring work to another session
---

# Create Handoff

You are tasked with writing a handoff document to hand off your work to another agent in a new session. You will create a handoff document that is thorough, but also **concise**. The goal is to compact and summarize your context without losing any of the key details of what you're working on.


## Process
### 1. Compose the handoff body
Compose the document body using the template below. Do NOT include YAML front-matter or the `## Metadata` section — the `thoughts_writer` agent handles both.

### 2. Delegate to thoughts_writer
Delegate the write via Task tool with `subagent_type: thoughts_writer`:
- Pass `<params>` with: `operation: new`, `type: handoff`, `topic`, `description`
- Pass the body in `<content>` tags (without front-matter or `## Metadata` section)
- thoughts_writer returns metadata (file_path, git info, date) and auto-appends the `## Metadata` section

Use the following template structure for the body content in `<content>` tags:
```markdown
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
