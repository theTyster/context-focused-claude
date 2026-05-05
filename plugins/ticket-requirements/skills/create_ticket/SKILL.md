---
name: create_ticket
description: Use when turning a vague request into a well-scoped ticket document in thoughts/tickets/
---

# Create Ticket

You are tasked with turning a fuzzy, informal request into a structured, reviewable ticket document stored in `thoughts/tickets/`. This command sits **before** `/research_codebase` in the workflow — its purpose is to clarify *what* to build before any investigation of *how* the code currently works.

## Workflow Position

```
/create_ticket  →  /research_codebase  →  /create_plan  →  /implement_plan  →  /validate_plan
```

After this command completes, the suggested next step is always:
```
/research_codebase "What does X do?" @thoughts/tickets/this-ticket.md
```

---

## Process

### Step 1: Read any referenced files first

If the user passes `@file` references, context documents, or existing notes, read them **fully** before doing anything else. Use the Read tool without limit/offset to read entire files. This ensures you have complete context before spawning any sub-agents.

### Step 2: Spawn `explore_ticket_requirements` agent

Delegate to the `explore_ticket_requirements` agent via the Task tool with `subagent_type: explore_ticket_requirements`.

Pass the user's full original request along with any relevant context from files you read in Step 1.

For complex requests with distinct facets, you may spawn multiple `explore_ticket_requirements` agents in parallel — for example, one focused on scope/acceptance criteria and another on risks/dependencies. Each agent operates read-only against the codebase. Synthesize their results before proceeding.

Example prompt to the agent:
```
The user wants to: [user's original request]

[Any relevant context from files read in Step 1]

Explore the requirements for this request. Ground your analysis in the actual codebase where relevant.
```

### Step 3: Present exploration results and ask for approval

Display the agent's structured exploration output to the user. Then ask:

> Does this capture what you're looking for? Would you like to:
> - Proceed and write this as a ticket
> - Clarify or adjust any section
> - Add or remove acceptance criteria
> - Resolve any of the open questions before writing

**Do not proceed to Step 4 without user confirmation.** This is an interactive checkpoint.

### Step 4: Incorporate user feedback

If the user requests changes, adjust the exploration output accordingly. You may re-run the `explore_ticket_requirements` agent with updated context if the feedback requires additional codebase investigation. Once the user approves, proceed.

### Step 5: Assemble the ticket document body

Compose the ticket document body using the template below. Combine:
- The user's original request (for the title and Problem section)
- The agent's structured exploration output (for all other sections)
- Any clarifications or adjustments from the user

Do NOT include YAML front-matter or a `## Metadata` section — the `thoughts_writer` agent handles both.

Use this template for the body content:

```markdown
# [Brief title derived from the user's request]

## Problem
[The symptom or user-facing gap — grounded in any relevant code the agent found. Reference specific files or components where applicable.]

## Goal
[What success looks like from a user or system perspective. Concrete, not aspirational.]

## Acceptance Criteria
- [ ] [Testable, binary, observable outcome]
- [ ] [Testable, binary, observable outcome]
- [ ] [Testable, binary, observable outcome]

## Out of Scope
- [Explicit non-goal]
- [Another explicit non-goal]

## Open Questions
- [Decision or ambiguity that must be resolved before implementation]
- [Another unresolved question]

## Suggested Next Step
/research_codebase "What does [relevant component] do?" @thoughts/tickets/[this-ticket-filename].md
```

### Step 6: Delegate to `thoughts_writer`

Delegate the write via Task tool with `subagent_type: thoughts_writer`:

- Pass `<params>` with: `operation: new`, `type: ticket`, `topic`, `description`
- Pass the body in `<content>` tags (without front-matter)

Example params block:
```
<params>
operation: new
type: ticket
topic: "Brief description of what the ticket is about"
description: kebab-case-slug-for-filename
</params>
```

The `thoughts_writer` agent will handle filename generation, directory placement, front-matter, and return the final file path.

### Step 7: Respond to the user

After `thoughts_writer` confirms the write, respond with the path to the ticket document and the suggested next step:

```
Ticket created at [file_path].

Suggested next step:
/research_codebase "What does [relevant component] do?" @[file_path]
```

---

## Important Notes

- **This command is interactive** — always present the exploration results and ask for approval before writing the ticket. Never skip Step 3.
- **The ticket is a specification artifact**, not a plan. It describes what to build and how to verify it — not how to implement it.
- **Keep the ticket grounded** — acceptance criteria should reference observable behavior, not implementation details.
- **Scope creep prevention** — Out of Scope items are mandatory. They exist to prevent the implementation phase from drifting.
- **Open questions are blocking** — if the ticket has open questions, the user should resolve them before running `/research_codebase`. Surface this explicitly in your Step 3 presentation.
- **Delegate writes faithfully** — pass the assembled body verbatim to `thoughts_writer`. Do not rephrase or restructure content inside `<content>` tags.
