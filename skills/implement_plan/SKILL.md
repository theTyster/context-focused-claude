---
name: implement_plan
description: Use when instructed
---

# Implement Plan

You are tasked with implementing an approved technical plan from `thoughts/plans/`. These plans contain phases with specific changes and success criteria.

## Core Principles
1. **Autonomous Decision Making**: Make all decisions based on presented documentation
2. **Precise Context Gathering**: Read mentioned files at their specified offsets

## Getting Started

When given a plan path:
- Read the original ticket and all files mentioned in the plan at their specified offsets
- Think deeply about how the pieces fit together
- **MANDATORY: Create a to-do list with at least 20 items** to guide the implementation and keep it focused
- Start implementing if you understand what needs to be done

If no plan path provided, ask for one.

## Implementation Philosophy

Plans are carefully designed, but reality can be messy. Your job is to:
- Follow the plan's intent while adapting to what you find
- Implement each phase fully before moving to the next
- Verify your work makes sense in the broader codebase context
- Update checkboxes in the plan as you complete sections

When things don't match the plan exactly, think about why and communicate clearly. The plan is your guide, but your judgment matters too.

If you encounter a mismatch:
- STOP and think deeply about why the plan can't be followed
- Present the issue clearly:
  ```
  Issue in Phase [N]:
  Expected: [what the plan says]
  Found: [actual situation]
  Why this matters: [explanation]

  How should I proceed?
  ```

## Verification, Validation, and Testing Approach

After implementing a phase, delegate all thoughts updates to thoughts_writer:
- Use the edit protocol with `<params>` including the path and optional status update
- **Update the `Current State` section** in the plan document:
  - Update the phase number and status
  - Set "Last verified" to the phase just completed and its result
  - Note any blockers or deviations from the original plan
- Update your progress in both the plan and your todos
- Check off completed items in the plan file

<example-invocation>
<params>
operation: edit
path: thoughts/plans/2026-02-26-feature-name.md
</params>

<content>
- Phase: 1 of 3 (in progress)
- Last verified: Phase 1 completed successfully

Check off the following items:
- [x] todo item
- [x] todo item
- [x] todo item
</content>
</example-invocation>

Do not check off items in the testing/validation steps unless explicitly instructed. This phase is handled by a different agent.


## If You Get Stuck

When something isn't working as expected:
- First, make sure you've read and understood all the relevant code
- Consider if the codebase has evolved since the plan was written
- Present the mismatch clearly and ask for guidance

## Resuming Work

If the plan has existing checkmarks:
- Trust that completed work is done
- Pick up from the first unchecked item
- Verify previous work only if something seems off

## Re-implementation from Validation Failure

If the user provides a validation results document (from `thoughts/validations/`) alongside the plan:
- Read the validation results document FULLY first
- Identify which validation checkpoints failed and why
- Focus implementation work ONLY on the failed areas — do not re-implement phases that passed validation
- When updating the plan's Current State, note that this is a re-implementation pass triggered by validation failure
- If the validation document indicates the plan itself needs changes (plan gaps), STOP and inform the user — the plan needs to be updated first before re-implementation
