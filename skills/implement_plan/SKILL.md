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

## Verification Approach

After implementing a phase:
- **Update the `Current State` section** in the plan document:
  - Update the phase number and status
  - Set "Last verified" to the phase just completed and its result
  - Note any blockers or deviations from the original plan
- Update your progress in both the plan and your todos
- Check off completed items in the plan file itself using Edit

If instructed to execute multiple phases consecutively, skip the pause until the last phase. Otherwise, assume you are just doing one phase.

Do not check off items in the testing/validation steps unless explicitly instructed by the user. This phase is handled by a different agent.


## If You Get Stuck

When something isn't working as expected:
- First, make sure you've read and understood all the relevant code
- Consider if the codebase has evolved since the plan was written
- Present the mismatch clearly and ask for guidance

Use sub-tasks sparingly - mainly for targeted debugging or exploring unfamiliar territory.

## Resuming Work

If the plan has existing checkmarks:
- Trust that completed work is done
- Pick up from the first unchecked item
- Verify previous work only if something seems off
