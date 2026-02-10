---
name: create_plan
description: Use when creating autonomous implementation plans through thorough research for sub-agents
---

# Implementation Plan

You are tasked with autonomously creating detailed implementation plans through thorough research and analysis. This skill is designed for sub-agents that need to create plans without user interaction.

## Core Principles

1. **Autonomous Decision Making**: Make all decisions based on research findings
2. **Thorough Research**: Use parallel sub-agents to gather comprehensive context
3. **No User Interaction**: Complete the entire planning process independently
4. **Actionable Output**: Produce a complete, ready-to-implement plan

## To-Do List Requirement

**MANDATORY: Create a to-do list using TodoWrite with at least 20 items before beginning work.** Break down the entire planning process: files to read, research tasks to spawn, components to analyze, design decisions to make, plan sections to write, and verification steps. Update items as you complete them throughout the process.

## Process Overview

### Step 1: Context Gathering

1. **Read all provided files completely**:
   - Ticket files (e.g., `thoughts/tickets/eng_1234.md`)
   - Research documents
   - Related implementation plans
   - Any JSON/data files mentioned
   - **IMPORTANT**: Use Read tool WITHOUT limit/offset parameters
   - **CRITICAL**: DO NOT spawn sub-tasks before reading these files yourself in the main context
   - **NEVER** read files partially - always read completely

2. **Spawn parallel research tasks**:
   Use specialized agents to research concurrently:

   - **codebase_locator** - Find all files related to the ticket/task
   - **codebase_analyzer** - Understand current implementation
   - **codebase_pattern_finder** - Find similar features to model after

   These agents will:
   - Find relevant source files, configs, and tests
   - Trace data flow and key functions
   - Return detailed explanations with file:line references

   Each agent knows how to:
   - Find the right files and code patterns
   - Identify conventions and patterns to follow
   - Look for integration points and dependencies
   - Return specific file:line references
   - Find tests and examples

3. **Read all identified files**:
   - After research tasks complete, read ALL files they identified
   - Read them FULLY into context
   - Cross-reference ticket requirements with actual code

### Step 2: Analysis & Design

1. **Analyze findings**:
   - Identify current state and what needs to change
   - Note patterns and conventions to follow
   - Determine integration points and dependencies
   - Identify potential complexities and edge cases

2. **Make design decisions**:
   - Choose implementation approach based on research
   - Follow existing patterns in the codebase
   - Select the most maintainable solution
   - Consider performance and scalability
   - Prioritize incremental, testable changes

3. **Define scope clearly**:
   - List what IS included in this plan
   - List what is NOT included (prevent scope creep)
   - Identify dependencies on other systems

### Step 3: Plan Structure

Organize the implementation into logical phases:

1. **Create initial plan outline**:
   ```
   Here's my proposed plan structure:

   ## Overview
   [1-2 sentence summary]

   ## Implementation Phases:
   1. [Phase name] - [what it accomplishes]
   2. [Phase name] - [what it accomplishes]
   3. [Phase name] - [what it accomplishes]

### Step 4: Write the Plan

Write to `thoughts/plans/YYYY-MM-DD-[ticket]-description.md`

**Filename format**:
- With ticket: `2025-01-08-ENG-1478-parent-child-tracking.md`
- Without ticket: `2025-01-08-improve-error-handling.md`

**Template structure**:

**Size budget: 2,000–10,000 tokens.** Maximum 10,000 tokens.

**MANDATORY MINIMUM: 2,000 tokens.** Before writing the file, estimate the document's token count. If it would be under 2,000 tokens, you MUST expand: add more specific file paths, more detailed change descriptions, more concrete success criteria, and code snippets. A plan under 2,000 tokens lacks the detail needed for an implementation agent to execute without ambiguity. Do NOT write the file until it meets the minimum.

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

### Key Discoveries:
- [Important finding with file:line reference]
- [Pattern to follow from existing code]
- [Constraint to work within]

## Desired End State

[Specification of desired end state and how to verify it]

## What We're NOT Doing

[Explicitly list out-of-scope items to prevent scope creep]

## Implementation Approach

[High-level strategy and reasoning]

## Phase 1: [Descriptive Name]

### Overview
[What this phase accomplishes]

### Changes Required:

#### 1. [Component/File Group]
**File**: `path/to/file.ext`
**Changes**: [Summary of changes]

```[language]
// Specific code to add/modify
```

### Success Criteria:

#### Automated Verification:
- [ ] Migration applies cleanly: `make migrate`
- [ ] Unit tests pass: `make test-component`
- [ ] Type checking passes: `npm run typecheck`
- [ ] Linting passes: `make lint`
- [ ] Integration tests pass: `make test-integration`

#### Manual Verification:
- [ ] Feature works as expected when tested via UI
- [ ] Performance is acceptable under load
- [ ] Edge case handling verified manually
- [ ] No regressions in related features

**Implementation Note**: After completing automated verification, pause for manual confirmation before proceeding to next phase.

---

## Phase 2: [Descriptive Name]

[Similar structure with both automated and manual success criteria...]

---

## Testing Strategy

### Unit Tests:
- [What to test with file:line references]
- [Key edge cases]

### Integration Tests:
- [End-to-end scenarios]
- [System integration points]

### Manual Testing Steps:
1. [Specific step to verify feature]
2. [Another verification step]
3. [Edge case to test manually]

## Performance Considerations

[Performance implications, optimizations needed, scalability concerns]

## Migration Notes

[How to handle existing data/systems, rollback strategy if needed]

## References

- Original ticket: `thoughts/tickets/eng_XXXX.md` (if applicable)
- Related research: `thoughts/research/[relevant].md`
- Similar implementation: `[file:line]`
- Relevant documentation: [links]
````

## Important Guidelines

### Be Skeptical
- Question vague requirements
- Identify potential issues early
- Ask "why" and "what about"
- Don't assume - verify with code

### Be Thorough
- Read all context files COMPLETELY before planning
- Research actual code patterns using parallel sub-agents
- Include specific file paths and line numbers
- Write measurable success criteria

### Be Decisive
- Make all design decisions based on research
- Choose the approach that best fits existing patterns
- Document reasoning for key decisions
- Don't leave open questions

### Be Practical
- Focus on incremental, testable changes
- Consider migration and rollback strategies
- Think about edge cases and error handling
- Include "what we're NOT doing" section

### Be Specific
- Every change should reference specific files
- Include code snippets showing before/after
- Success criteria must be measurable
- Commands must be runnable

## Success Criteria Guidelines

**Always separate success criteria into two categories:**

1. **Automated Verification** (can be run by execution agents):
   - Commands that can be run: `make test`, `npm run lint`, etc.
   - Specific files that should exist
   - Code compilation/type checking
   - Automated test suites
   - API endpoint checks

### Manual Verification
Requires human testing:
- UI/UX functionality
- Performance under real conditions
- Edge cases that are hard to automate
- User acceptance criteria
- Cross-browser/device testing

**Example format**:
```markdown
### Success Criteria:

#### Automated Verification:
- [ ] Database migration runs successfully: `make migrate`
- [ ] All unit tests pass: `go test ./...`
- [ ] No linting errors: `golangci-lint run`
- [ ] API endpoint returns 200: `curl localhost:8080/api/new-endpoint`

#### Manual Verification:
- [ ] Feature appears correctly in UI
- [ ] Performance acceptable with 1000+ items
- [ ] Error messages are user-friendly
- [ ] Works on mobile devices
```

## Common Patterns

### For Database Changes:
- Start with schema/migration
- Add store methods
- Update business logic
- Expose via API
- Update clients

### For New Features:
- Research existing patterns first
- Start with data model
- Build backend logic
- Add API endpoints
- Implement UI last

### For Refactoring:
- Document current behavior
- Plan incremental changes
- Maintain backwards compatibility
- Include migration strategy

## Sub-task Spawning Best Practices

### Spawning Sub-Tasks

1. **Spawn multiple tasks in parallel** for efficiency
2. **Each task should be focused** on a specific area
3. **Provide detailed instructions** including:
   - Exactly what to search for
   - Which directories to focus on
   - What information to extract
   - Expected output format
4. **Be EXTREMELY specific about directories**:
   - Include the full path context in your prompts
5. **Specify read-only tools** to use
6. **Request specific file:line references** in responses
7. **Wait for all tasks to complete** before synthesizing
8. **Verify sub-task results**:
   - If a sub-task returns unexpected results, spawn follow-up tasks
   - Cross-check findings against the actual codebase
   - Don't accept results that seem incorrect

Example of spawning multiple tasks:
```python
# Spawn these tasks concurrently:
tasks = [
    Task("Research database schema", db_research_prompt),
    Task("Find API patterns", api_research_prompt),
    Task("Investigate UI components", ui_research_prompt),
    Task("Check test patterns", test_research_prompt)
]
```

## Common Implementation Patterns

### Database Changes
1. Schema/migration
2. Store methods (CRUD)
3. Business logic updates
4. API endpoint exposure
5. Client updates

### New Features
1. Research existing patterns
2. Data model design
3. Backend logic
4. API endpoints
5. UI implementation

### Refactoring
1. Document current behavior
2. Plan incremental changes
3. Maintain backwards compatibility
4. Migration strategy
5. Deprecation timeline

## Plan Quality Checklist

Before considering plan complete:

- [ ] All mentioned files have been read completely
- [ ] Research tasks completed and synthesized
- [ ] Design decisions made and documented
- [ ] All phases have clear objectives
- [ ] Every change references specific files
- [ ] Success criteria are measurable
- [ ] Both automated and manual verification defined
- [ ] Scope clearly defined (in and out)
- [ ] Edge cases considered
- [ ] Migration/rollback strategy included
- [ ] No open questions remaining
- [ ] File saved to thoughts/plans/

## Output Format

After completing the plan:

1. Write the plan file to the correct location
2. Verify the file was created successfully
3. Return summary of the plan including:
   - Plan file path
   - Number of phases
   - Key implementation areas
   - Estimated complexity
   - Next steps (typically `/implement_plan`)

Remember: The goal is a complete, actionable plan that an implementation agent can execute without needing additional clarification.