---
name: create_plan
description: Use when creating autonomous implementation plans through thorough research for sub-agents
model: opus
---

# Implementation Plan
You are tasked with autonomously creating detailed implementation plans through thorough research and analysis. This skill is designed for sub-agents that need to create plans without user interaction.

## Core Principles
1. **Autonomous Decision Making**: Make all decisions based on research findings
2. **Thorough Research**: Use parallel sub-agents to gather comprehensive context
3. **No User Interaction**: Complete the entire planning process independently
4. **Actionable Output**: Produce a complete, ready-to-implement plan

## Create a To-Do List

**MANDATORY: Create a to-do list with the following items:**

1. **Read all provided files completely**:
 - Ticket files (e.g., `thoughts/tickets/eng_1234.md`)
 - Research documents
 - Related implementation plans
 - Any JSON/data files mentioned
 - **IMPORTANT**: Use the Read tool WITHOUT limit/offset parameters to read entire files
 - **CRITICAL**: DO NOT spawn sub-tasks before reading these files yourself in the main context
 - **NEVER** read files partially - if a file is mentioned, read it completely

2. **Spawn initial research tasks to gather context**:
 Before asking the user any questions, use specialized agents to research in parallel:

 - **codebase_locator** - Find all files related to the ticket/task
 - **codebase_analyzer** - Understand current implementation
 - **codebase_pattern_finder** - Find similar features to model after

 These agents will:
 - Find relevant source files, configs, and tests
 - Trace data flow and key functions
 - Return detailed explanations with file:line references

4. **Spawn parallel sub-tasks for deeper research**:
 - Create multiple Task agents to research different aspects concurrently
 - Use the right agent for each type of research:

 **Consider using these agents:**
 - **codebase_locator** - To find more specific files (e.g., "find all files that handle [specific component]")
 - **codebase_analyzer** - To understand implementation details (e.g., "analyze how [system] works")
 - **codebase_pattern_finder** - To find similar features we can model after

 Each agent knows how to:
 - Find the right files and code patterns
 - Identify conventions and patterns to follow
 - Look for integration points and dependencies
 - Return specific file:line references
 - Find tests and examples

5. **Read all identified files**:
 - After research tasks complete, read ALL files they identified
 - Read them FULLY into context

6. **Analyze findings**:
 - Identify current state and what needs to change
 - Note patterns and conventions to follow
 - Determine integration points and dependencies
 - Identify potential complexities and edge cases

7. **Think about design decisions**:
 - Choose implementation approach based on research
 - Follow existing patterns in the codebase
 - Consider the most maintainable solution
 - Consider performance and scalability
 - Prioritize incremental, testable changes

8. **Think about what is in scope**:
 - List what IS included in this plan
 - List what is NOT included (prevent scope creep)
 - Identify dependencies on other systems

9. **Write out the detailed plan**:
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

## Important Guidelines

### 1. Be Thorough
- Read all context files COMPLETELY before planning
- Research actual code patterns using parallel sub-agents
- Include specific file paths and line numbers
- Write measurable success criteria

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
