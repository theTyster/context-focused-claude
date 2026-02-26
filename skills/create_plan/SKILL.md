---
name: create_plan
description: Use when creating autonomous implementation plans from thorough research
model: opus
---

# Implementation Plan
You are tasked with autonomously creating detailed implementation plans based on thorough research and documentation which has already been performed.

## Core Principles
1. **Autonomous Decision Making**: Make all decisions based on research findings
2. **Thorough Research**: Use parallel sub-agents to gather comprehensive context
3. **No User Interaction**: Complete the entire planning process independently
4. **Actionable Output**: Produce a complete, ready-to-implement plan

## Create a To-Do List

**MANDATORY: Create a to-do list with the following items:**

1. **Spawn parallel sub-tasks to gather context**:
 - Create multiple agents to read all mentioned file offsets concurrently

2. **Analyze findings**:
 - Identify current state and what needs to change
 - Note patterns and conventions to follow
 - Determine integration points and dependencies
 - Identify potential complexities and edge cases
 - If more context is needed you may read specific, complete files in their entirety at the end of this step

3. **Think about design decisions**:
 - Choose implementation approach based on research
 - Follow existing patterns in the codebase
 - Consider the most maintainable solution
 - Consider performance and scalability
 - Prioritize incremental, testable changes

4. **Think about what is in scope**:
 - List what IS included in this plan
 - List what is NOT included (prevent scope creep)
 - Identify dependencies on other systems

5. **Write out the detailed plan**:
 - Write to `thoughts/plans/YYYY-MM-DD-[ticket]-description.md`
 
 **Filename format**:
 - With ticket: `2025-01-08-ENG-1478-parent-child-tracking.md`
 - Without ticket: `2025-01-08-improve-error-handling.md`

**Template structure**:
- Overview [1-2 sentence summary]

- Implementation Phases:
 1. [Phase name] - [what it accomplishes]
 2. [Phase name] - [what it accomplishes]
 3. [Phase name] - [what it accomplishes]

````markdown
---
status: in-progress
type: plan
topic: "[Feature/Task Name]"
---

# [Feature/Task Name] Implementation Plan

## Current State
- **Phase**: 0 of N (not started)
- **Last verified**: N/A
- **Blockers**: None
- **Deviations**: None

## Overview

[Brief description of what we're implementing and why]

## Current State Analysis

[What exists now, what's missing, key constraints discovered]

## Desired End State

[A Specification of the desired end state after this plan is complete, and how to verify it]

### Key Discoveries:
- [Important finding with file:line reference]
- [Pattern to follow from existing code]
- [Constraint to work within]

## What We're NOT Doing

[Explicitly list out-of-scope items to prevent scope creep]

## Implementation Approach

[High-level strategy and reasoning]

## Implementation Phases
### Phase 1: [Descriptive Name]

#### Overview
[What this phase accomplishes]

#### Changes Required:
 1. [Component/File Group]
 **File**: `path/to/file.ext`
 **Changes**: [Summary of changes]
```[filetype]
// Specific code to add/modify
```

 2. [Component/File Group]
 **File**: `path/to/file.ext`
 **Changes**: [Summary of changes]
```[filetype]
// Specific code to add/modify
```

 3. [Continue as needed...]

---

## Phase 2: [Descriptive Name]

[Similar structure with both automated and manual success criteria...]

---

## Testing and Validation Strategy

### Unit Tests:
- [What to test with file:line references]
- [Key edge cases]

### Integration Tests:
- [End-to-end scenarios]
- [System integration points]

### End-to-End Testing Steps:
1. [Specific step to verify feature]
2. [Another verification step]
3. [Edge case to test manually]

### Success Criteria:
[What is required for this change to be considered successful]

### Validation Checkpoints:
{ Below are some examples of checkpoints which might be used in validation:
 - [ ] Migration applies cleanly: `make migrate`
 - [ ] Unit tests pass: `make test-component`
 - [ ] Type checking passes: `npm run typecheck`
 - [ ] Linting passes: `make lint`
 - [ ] Integration tests pass: `make test-integration`
 - [ ] Feature works as expected when tested via UI
 - [ ] Performance is acceptable under load
 - [ ] Edge case handling verified manually
 - [ ] No regressions in related features
}

## Performance Considerations

[Performance implications, optimizations needed, scalability concerns]

## Migration Notes

[How to handle existing data/systems, rollback strategy if needed]

## References

- Original ticket: `thoughts/tickets/eng_XXXX.md` (if applicable)
- Related research: `thoughts/research/[relevant].md`
- Similar implementation: `[file:line]`
- Relevant documentation: [links]
- Validation State: untested
````

6. **Follow up**
After the document has been written respond with:
```
Please review and feel free to modify the plan document. Let me know if you would like to discuss any points from it.
```

## Important Guidelines

### 1. Be Thorough
- Read all mentioned thoughts COMPLETELY before planning
- Read actual code patterns from specified files at their designated offsets
- Read entire files if needed
- Write explicit and detailed plans

### 2. Be Decisive
- Make all design decisions based on research
- Choose the approach that best fits existing patterns
- Document reasoning for key decisions
- Don't leave open questions

### 3. Be Skeptical
- Question vague requirements
- Identify potential issues early
- Ask "why" and "what about"
- Don't assume - verify with code

### 4. Be Practical
- Focus on incremental, testable changes
- Consider migration and rollback strategies
- Encourage best practices
- Consider scope often

### Be Specific
- Every change should reference specific files
- Include code snippets showing before/after
- Success criteria must be measurable
- Commands must be runnable
