---
name: mega_ralph
description: Orchestrates autonomous development workflow from research through implementation with validation and failure recovery
model: opus
---

# Mega Ralph: Autonomous Development Workflow

You are tasked with orchestrating a complete autonomous development workflow that chains together research → planning → implementation → validation, with failure recovery via session handoffs.

## Parameter Handling

When this command is invoked, analyze the parameter to determine the starting point:

1. **No parameter provided**: Respond with an interactive prompt:
   ```
   I'm ready to orchestrate an autonomous development workflow. Please provide either:

   - A task description to start fresh (e.g., "Add rate limiting to API endpoints")
   - A handoff path to resume from a previous session (e.g., "thoughts/handoffs/2026-02-05_10-30-00_mega-ralph-rate-limiting.md")

   What would you like me to work on?
   ```
   Then wait for user input.

2. **Path containing `thoughts/handoffs/`**: Jump to **PHASE 0: Resume from Handoff**

3. **Any other text**: Treat as task description, jump to **PHASE 1: Research**

---

## PHASE 0: Resume from Handoff

When resuming from a handoff document:

1. **Read the handoff document completely** using the Read tool WITHOUT limit/offset parameters

2. **Extract critical information**:
   - Current phase when handoff was created
   - `RESEARCH_PATH` - path to research document
   - `PLAN_PATH` - path to implementation plan
   - Failure context and learnings
   - Action items and next steps

3. **Read all referenced artifacts**:
   - Read the research document at `RESEARCH_PATH` (if exists)
   - Read the plan document at `PLAN_PATH` (if exists)
   - Read any other files mentioned in learnings or artifacts

4. **Determine resume point**:
   - If handoff indicates research incomplete → Resume at **PHASE 1**
   - If handoff indicates plan incomplete → Resume at **PHASE 2**
   - If handoff indicates implementation failure → Resume at **PHASE 3** with failure context
   - If handoff indicates validation failure → Resume at **PHASE 4**

5. **Present resumption plan**:
   ```
   Resuming from handoff: [handoff_path]

   Previous session state:
   - Phase: [phase when stopped]
   - Research: [RESEARCH_PATH or "not yet created"]
   - Plan: [PLAN_PATH or "not yet created"]
   - Failure reason: [reason or "N/A"]

   Resuming at PHASE [N]: [phase name]

   Proceeding with: [specific action]
   ```

6. **Jump to the appropriate phase**

---

## PHASE 1: Research

**Goal**: Thoroughly understand the codebase and gather context for the task.

### Step 1.1: Formulate Research Questions

Based on the task description, identify:
- What components/systems are involved?
- What patterns exist that we should follow?
- What files will likely need modification?
- What are the integration points?

### Step 1.2: Spawn Parallel Research Sub-Agents

Spawn multiple Task agents concurrently for comprehensive research:

```
Task 1 - codebase_locator:
Find all files and components related to [task topic].
Focus on: [specific areas based on task]
Return: File paths organized by relevance

Task 2 - codebase_analyzer:
Analyze how [relevant system] currently works.
Understand: Current implementation, data flow, key functions
Return: Detailed explanation with file:line references

Task 3 - codebase_pattern_finder:
Find similar implementations or patterns for [task type].
Look for: Existing examples we should model after
Return: Code examples with file:line references
```

**IMPORTANT**: Spawn all three agents in parallel using a single message with multiple Task tool calls.

### Step 1.3: Wait and Synthesize

1. **Wait for ALL sub-agents to complete**
2. **Read key files** identified by the research agents
3. **Synthesize findings** into a coherent understanding

### Step 1.4: Write Research Document

Generate a slug from the task description (kebab-case, max 5 words).

Write research document to: `thoughts/research/YYYY-MM-DD-mega-ralph-[slug].md`

Use this structure:
```markdown
---
date: [Current date and time with timezone in ISO format]
researcher: mega_ralph
git_commit: [Current commit hash]
branch: [Current branch name]
repository: [Repository name]
topic: "[Task Description]"
tags: [research, mega-ralph, relevant-component-names]
status: complete
---

# Research: [Task Description]

## Research Question
[Original task description and derived questions]

## Summary
[High-level findings answering the research questions]

## Detailed Findings

### [Component/Area 1]
- Description with file:line references
- How it connects to other components
- Patterns to follow

### [Component/Area 2]
...

## Code References
- `path/to/file.ext:line` - Description
- `another/file.ext:line-range` - Description

## Implementation Considerations
[Key constraints, patterns, and decisions for the plan]

## Open Questions
[Any areas needing clarification - should be minimal]
```

### Step 1.5: Store Path and Proceed

```
RESEARCH_PATH = thoughts/research/YYYY-MM-DD-mega-ralph-[slug].md
```

**Proceed to PHASE 2**

---

## PHASE 2: Create Plan

**Goal**: Design a detailed, phased implementation plan based on research.

### Step 2.1: Read Research Document

Read the research document at `RESEARCH_PATH` completely.

### Step 2.2: Design Implementation Approach

Based on research findings:
- Identify the sequence of changes needed
- Group changes into logical phases
- Define automated verification commands for each phase
- Define manual verification criteria for each phase
- Consider rollback strategies

### Step 2.3: Write Implementation Plan

Use the same slug as the research document.

Write plan to: `thoughts/plans/YYYY-MM-DD-mega-ralph-[slug].md`

Use this structure:
```markdown
# [Task Description] Implementation Plan

## Overview
[Brief description of what we're implementing and why]

## Current State Analysis
[Key findings from research with file:line references]

## Desired End State
[Specification of the goal and how to verify success]

## What We're NOT Doing
[Explicitly list out-of-scope items]

## Implementation Approach
[High-level strategy and reasoning]

---

## Phase 1: [Descriptive Name]

### Overview
[What this phase accomplishes]

### Changes Required

#### 1. [Component/File]
**File**: `path/to/file.ext`
**Changes**: [Summary]
```[language]
// Code to add/modify
```

### Success Criteria

#### Automated Verification:
- [ ] [Verification]: `command to run`
- [ ] [Verification]: `command to run`

#### Manual Verification:
- [ ] [Manual check description]
- [ ] [Manual check description]

---

## Phase 2: [Descriptive Name]
[Same structure as Phase 1...]

---

## Testing Strategy

### Automated Tests:
- [What to test]

### Manual Testing Steps:
1. [Specific step]
2. [Specific step]

## References
- Research: `[RESEARCH_PATH]`
- Similar implementation: `file:line`
```

### Step 2.4: Store Path and Proceed

```
PLAN_PATH = thoughts/plans/YYYY-MM-DD-mega-ralph-[slug].md
```

**Proceed to PHASE 3**

---

## PHASE 3: Implement Plan

**Goal**: Execute the implementation plan phase by phase with verification.

### Step 3.1: Setup Progress Tracking

Use TodoWrite to create tasks for each phase:
```
- Phase 1: [Name] - [Description]
- Phase 2: [Name] - [Description]
- Phase N: [Name] - [Description]
- Validation: Run final verification
```

### Step 3.2: Implement Each Phase

For each phase in the plan:

1. **Read the phase details** from the plan
2. **Implement the changes** as specified
3. **Run automated verification** commands from success criteria
4. **Handle failures**:
   - If automated verification fails, attempt to fix (max 3 attempts per issue)
   - If unable to fix after 3 attempts → **Jump to PHASE 5**
5. **Update progress**:
   - Check off completed items in the plan using Edit
   - Update TodoWrite status

### Step 3.3: Phase Completion Check

After each phase's automated verification passes:

```
Phase [N] automated verification complete.

Passed:
- [List of automated checks that passed]

Proceeding to Phase [N+1]...
```

**Continue until all phases complete, then proceed to PHASE 4**

**On repeated failure (3+ attempts on same issue) → Jump to PHASE 5**

---

## PHASE 4: Validate Implementation

**Goal**: Comprehensive validation of the complete implementation.

### Step 4.1: Re-run All Automated Verification

Run every automated verification command from all phases:
- Collect pass/fail status for each
- Document any failures

### Step 4.2: Generate Validation Report

```markdown
## Validation Report: [Task Description]

### Automated Verification Results
✓ [Check 1]: `command` - PASSED
✓ [Check 2]: `command` - PASSED
✗ [Check 3]: `command` - FAILED (if any)

### Implementation Status
- Phase 1: [Name] - ✓ Complete
- Phase 2: [Name] - ✓ Complete
- Phase N: [Name] - ✓ Complete

### Manual Testing Required
The following items require human verification:
1. [Manual check from plan]
2. [Manual check from plan]
```

### Step 4.3: Determine Outcome

**If ALL automated criteria pass**:
```
SUCCESS! Implementation complete.

All automated verification passed. Please perform the following manual tests:
1. [Manual verification item]
2. [Manual verification item]

Artifacts created:
- Research: [RESEARCH_PATH]
- Plan: [PLAN_PATH]
```
**STOP - Workflow complete**

**If ANY automated criteria fail**:
```
Validation failed. [N] automated checks did not pass.

Failed checks:
- [Check]: [Error output]

Proceeding to create failure handoff for session restart...
```
**Proceed to PHASE 5**

---

## PHASE 5: Create Failure Handoff

**Goal**: Document failure context for resumption in a new session.

### Step 5.1: Gather Context

Collect all relevant information:
- Current phase when failure occurred
- `RESEARCH_PATH` and `PLAN_PATH`
- Specific failures and error messages
- Attempted fixes and their outcomes
- Key learnings from the attempt

### Step 5.2: Write Handoff Document

Write to: `thoughts/handoffs/YYYY-MM-DD_HH-MM-SS_mega-ralph-[slug].md`

Use this structure:
```markdown
---
date: [Current date and time with timezone in ISO format]
researcher: mega_ralph
git_commit: [Current commit hash]
branch: [Current branch name]
repository: [Repository name]
topic: "[Task Description] - Mega Ralph Handoff"
tags: [handoff, mega-ralph, failure-recovery]
status: incomplete
type: mega_ralph_handoff
---

# Mega Ralph Handoff: [Task Description]

## Workflow State

**Phase at failure**: PHASE [N] - [Name]
**RESEARCH_PATH**: `[path]`
**PLAN_PATH**: `[path]`

## Task Description
[Original task that was being worked on]

## Failure Context

### What Failed
[Specific failure description]

### Error Output
```
[Relevant error messages]
```

### Attempted Fixes
1. [Attempt 1]: [Result]
2. [Attempt 2]: [Result]
3. [Attempt 3]: [Result]

## Learnings
- [Important discovery with file:line reference]
- [Pattern or constraint learned]
- [Root cause analysis if determined]

## Recent Changes Made
- `file:line` - [Description of change]
- `file:line` - [Description of change]

## Artifacts
- Research: `[RESEARCH_PATH]`
- Plan: `[PLAN_PATH]`

## Resume Instructions

To resume this workflow, run:
```
/mega_ralph [this handoff path]
```

The workflow will:
1. Read this handoff and all referenced artifacts
2. Resume at PHASE [N] with failure context
3. Attempt alternative approaches based on learnings

## Recommended Next Steps
1. [Specific action based on failure analysis]
2. [Alternative approach to try]
3. [Additional research if needed]
```

### Step 5.3: Inform User

```
Workflow paused due to failures. Handoff created at:
[handoff_path]

To resume in a new session with fresh context, run:
/mega_ralph [handoff_path]

Summary of issues:
- [Brief failure summary]

Recommended approach for next attempt:
- [Suggestion based on learnings]
```

**STOP - Session should be restarted**

---

## Guidelines

### Context Management
- Use sub-agents for research phases to keep main context focused
- Main context handles implementation for coherent changes
- Store artifact paths immediately after creation

### Artifact Discipline
- Always use absolute paths for artifact references
- Store `RESEARCH_PATH` and `PLAN_PATH` as soon as documents are created
- Reference artifacts by path in all subsequent phases

### Error Recovery
- Any unrecoverable error during implementation → PHASE 5
- Max 3 fix attempts per specific issue
- Document all learnings even on failure

### Progress Visibility
- Use TodoWrite to track phase completion
- Provide status updates between phases
- Update plan checkboxes as work completes

### Autonomous Operation
- Make decisions based on research findings
- Follow existing codebase patterns
- Only pause for user input on true blockers or completion

---

## Example Invocations

```bash
# Fresh start with task description
/mega_ralph Add rate limiting to API endpoints

# Resume from previous handoff
/mega_ralph thoughts/handoffs/2026-02-05_10-30-00_mega-ralph-rate-limiting.md

# Interactive prompt
/mega_ralph
```
