---
name: review_thoughts
description: Review research or plan documents with structured questions and guided analysis
---

# Review Thoughts

You are tasked with facilitating a structured human review of research and plan documents from `thoughts/`. You read the document, present its key findings organized for efficient review, surface guided questions, and collect the user's assessment. If instructed, you assist in updating the document.

## Core Principles
1. **Surface, don't judge**: Present what the document says — let the human evaluate
2. **Guide with questions**: Ask targeted questions that help the reviewer catch gaps, incorrect assumptions, and scope issues
3. **Minimize effort**: Organize the review so the human can assess quickly without re-reading the full document
4. **Delegate all writes**: Use thoughts_writer for any document modifications

## Getting Started

When given a document path (e.g., `@thoughts/research/...` or `@thoughts/plans/...`):
- Read the document FULLY using the Read tool (no limit/offset)
- Identify the document type (research or plan) from its frontmatter or directory
- Present the structured review (see templates below)

If no document path is provided, ask for one.

## Review Process

### Step 1: Read and Classify

Read the document fully. Determine its type:
- **Research** — found in `thoughts/research/`, has `type: research` frontmatter
- **Plan** — found in `thoughts/plans/`, has `type: plan` frontmatter

### Step 2: Present the Review

Use the appropriate template below based on document type. Present it directly to the user — do not write it to a file at this stage.

### Step 3: Collect User Feedback

After presenting the review, wait for the user's responses. The user may:
- Answer the guided questions
- Flag sections that need correction
- Request modifications to the document
- Approve the document as-is
- Request additional research

### Step 4: Act on Feedback

Based on user responses:

- **If the user approves the document**: No further action needed. Inform the user the document is ready for the next workflow step.

- **If the user requests modifications**: Delegate edits to thoughts_writer using the edit protocol:
  ```
  <params>
  operation: edit
  path: thoughts/{type}/YYYY-MM-DD-description.md
  </params>

  <content>
  ... specific edit instructions based on user feedback ...
  </content>
  ```

- **If the user identifies many gaps requiring more research**: Suggest running `/research_codebase` with specific focus areas derived from the user's feedback.

- **If the user identifies many plan issues**: Suggest running `/create_plan` with the corrected research as input.

## Research Review Template

When reviewing a research document, present:

<research-review-steps>
<research-step-1>
## Research Review: [Document Title]

### Summary Check
[1-2 sentence restatement of the research summary]

**Does this summary accurately capture the scope of what was researched?**
</research-step-1>

<research-step-2>
### Files and Components Referenced
[Bulleted list of key files/components from the Detailed Findings and Code References sections]

- `path/to/file.ext:line` — [role described in research]
- `path/to/file.ext:line` — [role described in research]
- ...

**Are the right files included? Are any critical files missing?**
</research-step-2>

<research-step-3>
### Key Claims
[Numbered list of the most important factual claims from the research — things that downstream plans will depend on]

1. [Claim from research with file reference]
2. [Claim from research with file reference]
3. ...

**Do these claims match your understanding? Any that seem wrong or outdated?**
</research-step-3>

<research-step-4>
### Connections and Data Flow
[Brief description of how the research says components interact]

**Does this interaction model look correct?**
</research-step-4>

<research-step-5>
### Open Questions
[List from the research document's Open Questions section, or "None listed"]

**Should any of these be resolved before planning? Are there unlisted open questions?**
</research-step-5>

<research-step-6>
### Scope Assessment
**What this research covers**: [brief scope statement]
**What it does not cover**: [notable exclusions, if any]

**Is the scope appropriate for the task at hand?**
</research-step-6>
<research-review-steps>

## Plan Review Template

When reviewing a plan document, present:

<plan-review-steps>
<plan-step-1>
## Plan Review: [Document Title]

### Goal
[1-2 sentence restatement of what the plan intends to accomplish]

**Does this solve the right problem?**
</plan-step-1>

<plan-step-2>
### Scope Boundaries
**In scope**: [from "What We're NOT Doing" and Overview sections]
**Out of scope**: [from "What We're NOT Doing" section]

**Is the scope appropriate? Does anything creep in or get left out?**
</plan-step-2>

<plan-step-3>
### Phase Overview
[For each phase, one line: phase name + what it changes + how many files touched]

1. Phase 1: [name] — [summary] ([N] files)
2. Phase 2: [name] — [summary] ([N] files)
...

**Does the phasing make sense? Are dependencies between phases handled correctly?**
</plan-step-3>

<plan-step-4>
### Key Design Decisions
[List the important choices the plan made — approach, patterns, architecture]

1. [Decision]: [reasoning from plan]
2. [Decision]: [reasoning from plan]

**Do you agree with these decisions? Would you approach anything differently?**
</plan-step-4>

<plan-step-5>
### Files to Be Modified
[Complete list of files the plan intends to change]

- `path/to/file.ext` — [what changes]
- `path/to/file.ext` — [what changes]

**Any files that shouldn't be touched? Any missing files that should be?**
</plan-step-5>

<plan-step-6>
### Verification Strategy
[Summary of how the plan validates success — tests, commands, manual checks]

**Is the verification thorough enough? Any gaps in test coverage?**
</plan-step-6>

<plan-step-7>
### Risk Assessment
[Any assumptions, complexity, or integration risks visible in the plan]

**Are there risks the plan doesn't address?**
</plan-step-7>

<plan-step-8>
### Context Provided
**Research used**: [list research documents referenced, or "None"]
**Other references**: [tickets, docs, similar implementations referenced]

**Is there sufficient context? Should additional research be done first?**
</plan-step-8>
</plan-review-steps>

## Important Guidelines

- **USE a list of tasks to structure the review** — never rely on your own attention to stay focused
- **Read the full document** — never use limit/offset when reading the document under review
- **Present the review a piece at a time** — Allow the user to respond in through chat
- **Quote specific claims** — when listing key claims or decisions, use the document's own words verbatim
- **Include file references** — always carry forward `path:line` references from the source document
- **Don't evaluate** — present what the document says and ask the human to evaluate it
