# Adapt Context-Focused Claude to Independent Fork - Implementation Plan

## Overview

Transform the context-focused-claude repository from a humanlayer-dependent project into an independent Claude Code plugin by removing humanlayer-specific dependencies, adapting commands to use only built-in tools, and creating proper plugin infrastructure.

## Current State Analysis

**What Exists Now**:
- 25 command files in `commands/` directory (mix of keep/adapt/remove)
- 6 specialized agent files in `agents/` directory (all independent, keep as-is)
- 1 research document in `thoughts/shared/research/`
- No git repository initialized
- No `plugin.json` manifest
- Commands reference humanlayer-specific tools (`humanlayer thoughts sync`, `gh` CLI)
- Paths use `thoughts/shared/` structure

**Key Constraints**:
- Must remain independent (no external MCP servers or CLIs beyond standard git)
- Must use only built-in Claude Code tools
- Must maintain context management architecture (parallel sub-agents)
- Research from `thoughts/shared/research/2026-02-02-command-evaluation.md:1-373` guides all changes

## Desired End State

An independent Claude Code plugin that:
- Has no humanlayer or Linear dependencies
- Uses only git (not gh CLI) for version control
- Stores thoughts in simplified directory structure (`thoughts/{research,plans,handoffs}/`)
- Has proper `plugin.json` manifest for Claude Code integration
- All 10 "keep" files work without modification
- All 9 "adapt" files work with only built-in tools
- 15+ "remove" files are deleted
- Is a proper git repository with initial commit

### Verification:
- `/create_plan_nt` command works without TodoWrite errors
- `/research_codebase_nt` command saves to `thoughts/research/`
- Handoff commands work without `humanlayer thoughts sync`
- `plugin.json` is valid and loads in Claude Code
- Git repository exists with clean history

## What We're NOT Doing

- Not adding new features or commands
- Not modifying the 6 agent files (already independent)
- Not integrating with Linear, MCP servers, or external tools
- Not changing the core context management architecture
- Not modifying the parallel sub-agent spawning patterns
- Not changing YAML frontmatter structures

## Implementation Approach

Work in phases: setup → remove → adapt → configure → verify. Each phase has clear automated success criteria. Manual testing only needed for final verification.

---

## Phase 1: Setup & Cleanup

### Overview
Initialize git repository and remove all humanlayer-specific files that won't be adapted.

### Changes Required:

#### 1. Initialize Git Repository
**Commands**:
```bash
cd /home/ty/Projects/mine/context-focused-claude
git init
git config user.name "ty"
git config user.email "ty@context-focused-claude"
```

#### 2. Remove Humanlayer-Specific Commands (15 files)

**Files to Delete**:

Ralph Commands (3 files):
- `commands/ralph_plan.md`
- `commands/ralph_impl.md`
- `commands/ralph_research.md`

Oneshot Commands (2 files):
- `commands/oneshot.md`
- `commands/oneshot_plan.md`

Worktree Commands (2 files):
- `commands/create_worktree_implementation.md`
- `commands/create_worktree_plan.md`

Integration Commands (4 files):
- `commands/local_review.md`
- `commands/debug.md`
- `commands/founder_mode.md`
- `commands/linear.md`

Original Research Command (1 file):
- `commands/research_codebase.md` (keep _nt and _generic variants)

Iterate Plan Command (1 file):
- `commands/iterate_plan.md` (missing _nt suffix, likely needs adaptation or removal)

Git Commands to Adapt (2 files, will adapt later):
- `commands/commit.md` (needs thoughts/ exclusion removed)
- `commands/ci_commit.md` (needs thoughts/ exclusion removed)

**Deletion Commands**:
```bash
rm commands/ralph_plan.md commands/ralph_impl.md commands/ralph_research.md
rm commands/oneshot.md commands/oneshot_plan.md
rm commands/create_worktree_implementation.md commands/create_worktree_plan.md
rm commands/local_review.md commands/debug.md commands/founder_mode.md commands/linear.md
rm commands/research_codebase.md
rm commands/iterate_plan.md
```

### Success Criteria:

#### Automated Verification:
- [x] Git repository initialized: `test -d .git && echo "Git initialized"`
- [x] 15 files removed: `test ! -f commands/ralph_plan.md && test ! -f commands/oneshot.md && echo "Files removed"`
- [x] Remaining command count is 12: `ls -1 commands/*.md | wc -l` (actual: 12, includes validate_plan.md and research_codebase_nt.md)
- [x] All 6 agents still exist: `ls -1 agents/*.md | wc -l` (should output 6)

#### Manual Verification:
- [ ] Verify correct files were removed (all humanlayer-specific)
- [ ] Verify no accidentally deleted files

---

## Phase 2: Adapt Handoff System

### Overview
Remove `humanlayer thoughts sync` dependencies and simplify directory paths from `thoughts/shared/handoffs/` to `thoughts/handoffs/`.

### Changes Required:

#### 1. File: `commands/create_handoff.md`

**Line 19-22: Remove spec_metadata.sh dependency**

OLD:
```bash
metadata_result=$(bash scripts/spec_metadata.sh)
```

NEW (inline metadata generation):
```bash
# Generate metadata inline
current_date=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
git_commit=$(git rev-parse HEAD 2>/dev/null || echo "N/A (not in git repository)")
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "N/A")
repository=$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" || basename "$PWD")
```

**Lines 53-56: Update handoff path**

OLD:
```markdown
handoff_path="thoughts/shared/handoffs/${timestamp}_${description_slug}.md"
```

NEW:
```markdown
handoff_path="thoughts/handoffs/${timestamp}_${description_slug}.md"
```

**Lines 95-98: Remove humanlayer sync**

OLD (if exists):
```bash
humanlayer thoughts sync
```

NEW:
```bash
# No sync needed - using local thoughts directory only
```

#### 2. File: `commands/resume_handoff.md`

**Line 21: Remove humanlayer sync reference**

Search for any `humanlayer thoughts sync` calls and remove them.

**Update all path references from `thoughts/shared/handoffs/` to `thoughts/handoffs/`**

Search for: `thoughts/shared/handoffs`
Replace with: `thoughts/handoffs`

### Success Criteria:

#### Automated Verification:
- [x] No `humanlayer` references in handoff files: `! grep -r "humanlayer" commands/create_handoff.md commands/resume_handoff.md`
- [x] No `scripts/spec_metadata.sh` references: `! grep "spec_metadata.sh" commands/create_handoff.md`
- [x] No `thoughts/shared/handoffs` paths: `! grep "thoughts/shared/handoffs" commands/create_handoff.md commands/resume_handoff.md`
- [x] New paths exist: `grep -q "thoughts/handoffs" commands/create_handoff.md`

#### Manual Verification:
- [ ] Read both handoff files to verify logic still makes sense
- [ ] Verify inline metadata generation is complete

---

## Phase 3: Adapt Planning System

### Overview
Remove TodoWrite dependencies from planning commands and simplify paths to `thoughts/plans/`.

### Changes Required:

#### 1. File: `commands/create_plan_nt.md`

**Line 100: Remove TodoWrite from research step**

Search for TodoWrite references around line 100 and make them optional:

OLD:
```markdown
1. **Create a research todo list** using TodoWrite to track exploration tasks
```

NEW:
```markdown
1. **Track research tasks** (optional: use TodoWrite if available, otherwise track mentally)
```

**Lines 329-333: Remove TodoWrite requirement**

Remove or make optional the TodoWrite requirement in tracking progress section.

**Update plan path format in Step 4 (around line 200)**

OLD:
```markdown
thoughts/shared/plans/YYYY-MM-DD-ENG-XXXX-description.md
```

NEW:
```markdown
thoughts/plans/YYYY-MM-DD-ENG-XXXX-description.md
```

Update example paths throughout:
- OLD: `thoughts/shared/plans/2025-01-08-ENG-1478-parent-child-tracking.md`
- NEW: `thoughts/plans/2025-01-08-ENG-1478-parent-child-tracking.md`

**Line 440 area: Update references section paths**

OLD:
```markdown
- Original ticket: `thoughts/shared/tickets/eng_XXXX.md`
- Related research: `thoughts/shared/research/[relevant].md`
```

NEW:
```markdown
- Original ticket: `thoughts/tickets/eng_XXXX.md` (if applicable)
- Related research: `thoughts/research/[relevant].md`
```

#### 2. File: `commands/iterate_plan_nt.md` (if exists)

If this file doesn't exist, we can skip this. If it does:
- Remove TodoWrite dependencies
- Update paths from `thoughts/shared/plans/` to `thoughts/plans/`

#### 3. File: `commands/implement_plan.md`

**Lines 16, 48: Make TodoWrite optional**

Search for TodoWrite usage and wrap in conditionals:

OLD:
```markdown
Use TodoWrite to track tasks
```

NEW:
```markdown
Track tasks using available tools (TodoWrite if available, otherwise manual tracking)
```

### Success Criteria:

#### Automated Verification:
- [x] No `thoughts/shared/plans` in planning files: `! grep "thoughts/shared/plans" commands/create_plan_nt.md commands/implement_plan.md`
- [x] New paths exist: `grep -q "thoughts/plans" commands/create_plan_nt.md`
- [x] TodoWrite is optional, not required: `! grep -E "must.*TodoWrite|require.*TodoWrite" commands/create_plan_nt.md commands/implement_plan.md`

#### Manual Verification:
- [ ] Read planning commands to verify TodoWrite is truly optional
- [ ] Verify plan template examples use correct paths

---

## Phase 4: Adapt PR Description Commands

### Overview
Remove `gh` CLI dependencies, use pure `git` commands, and fix `/tmp/` storage to use `thoughts/` directory instead.

### Changes Required:

#### 1. File: `commands/describe_pr.md`

**Lines 59-62: Remove humanlayer thoughts sync**

Remove any `humanlayer thoughts sync` calls.

**Replace gh commands with git commands throughout**

Common patterns to replace:

OLD:
```bash
gh pr view --json title,body
```

NEW:
```bash
# Get PR info from git branch and commits
git log origin/main..HEAD --oneline
git diff origin/main...HEAD --stat
```

**Fix /tmp/ storage issue**

Search for `/tmp/` paths and replace:

OLD:
```bash
output_file="/tmp/pr_description.md"
```

NEW:
```bash
output_file="thoughts/pr_descriptions/$(date +%Y-%m-%d-%H-%M-%S)_pr_description.md"
```

#### 2. File: `commands/describe_pr_nt.md`

Apply same changes as `describe_pr.md`:
- Remove gh CLI usage
- Use pure git commands
- Change storage from `/tmp/` to `thoughts/pr_descriptions/`

#### 3. File: `commands/ci_describe_pr.md`

Apply same changes as other PR description files:
- Remove gh CLI
- Use git commands
- Fix storage path

### Success Criteria:

#### Automated Verification:
- [x] No `gh` commands in PR files: `! grep -E "gh pr|gh api" commands/describe_pr*.md`
- [x] No `/tmp/` paths: `! grep "/tmp/" commands/describe_pr*.md`
- [x] New storage path exists: `grep -q "thoughts/pr_descriptions" commands/describe_pr.md`
- [x] No humanlayer sync: `! grep "humanlayer" commands/describe_pr*.md`

#### Manual Verification:
- [ ] Read PR description logic to verify git commands provide equivalent functionality
- [ ] Verify PR description format is preserved

---

## Phase 5: Adapt Research Commands & Git Workflow

### Overview
Remove humanlayer integrations from generic research command and update git commit commands to remove thoughts/ directory exclusions.

### Changes Required:

#### 1. File: `commands/research_codebase_generic.md`

**Remove humanlayer integrations**

Search for and remove:
- Any `humanlayer thoughts sync` calls
- Any Linear MCP references
- Any humanlayer CLI commands

**Update storage path**

OLD:
```markdown
thoughts/shared/research/
```

NEW:
```markdown
thoughts/research/
```

#### 2. File: `commands/commit.md`

**Remove thoughts/ directory exclusions if present**

If there are any exclusions of thoughts/ directory from commits, remove them. We want thoughts/ to be committable.

#### 3. File: `commands/ci_commit.md`

**Lines 25-27: Remove thoughts/ directory exclusions**

OLD (if exists):
```bash
git add . ":(exclude)thoughts/"
```

NEW:
```bash
git add .
```

### Success Criteria:

#### Automated Verification:
- [x] No humanlayer in research_codebase_generic: `! grep "humanlayer" commands/research_codebase_generic.md`
- [x] Updated path in generic research: `grep -q "thoughts/research" commands/research_codebase_generic.md`
- [x] No thoughts/ exclusions in commit files: `! grep "exclude.*thoughts" commands/commit.md commands/ci_commit.md`

#### Manual Verification:
- [ ] Verify research command logic still works
- [ ] Verify commit commands include thoughts/ directory

---

## Phase 6: Restructure thoughts/ Directory

### Overview
Move existing research document and create new directory structure without `shared/` level.

### Changes Required:

#### 1. Create New Directory Structure

**Commands**:
```bash
mkdir -p thoughts/research
mkdir -p thoughts/plans
mkdir -p thoughts/handoffs
mkdir -p thoughts/pr_descriptions
mkdir -p thoughts/tickets
```

#### 2. Move Existing Research Document

**Commands**:
```bash
mv thoughts/shared/research/2026-02-02-command-evaluation.md thoughts/research/
```

#### 3. Update Research Document Frontmatter (Optional)

The document frontmatter has the old path structure, but since it's just metadata, this is optional.

#### 4. Remove Old Directory Structure

**Commands**:
```bash
rmdir thoughts/shared/research
rmdir thoughts/shared
```

### Success Criteria:

#### Automated Verification:
- [x] New directories exist: `test -d thoughts/research && test -d thoughts/plans && test -d thoughts/handoffs`
- [x] Research doc moved: `test -f thoughts/research/2026-02-02-command-evaluation.md`
- [x] Old structure gone: `test ! -d thoughts/shared`
- [x] Directory count correct: `find thoughts -maxdepth 1 -type d | wc -l` (should be 6: thoughts/ + 5 subdirs)

#### Manual Verification:
- [ ] Verify file moved correctly and is readable
- [ ] Verify all new directories are created

---

## Phase 7: Create Plugin Configuration

### Overview
Create `plugin.json` manifest to properly register this as a Claude Code plugin.

### Changes Required:

#### 1. Create plugin.json

**File**: `plugin.json`

**Content**:
```json
{
  "name": "context-focused-claude",
  "version": "1.0.0",
  "description": "Independent context-management system for Claude Code using parallel sub-agents and structured documentation",
  "author": "ty",
  "license": "MIT",
  "claude": {
    "minVersion": "0.1.0"
  },
  "components": {
    "agents": {
      "directory": "agents",
      "autoDiscover": true
    },
    "commands": {
      "directory": "commands",
      "autoDiscover": true
    }
  },
  "settings": {
    "thoughtsDirectory": "thoughts",
    "researchSubdir": "research",
    "plansSubdir": "plans",
    "handoffsSubdir": "handoffs"
  },
  "dependencies": {
    "tools": [
      "Read",
      "Write",
      "Edit",
      "Bash",
      "Grep",
      "Glob",
      "LS",
      "WebSearch",
      "WebFetch",
      "Task"
    ],
    "external": []
  },
  "features": {
    "parallelSubAgents": true,
    "contextCompaction": true,
    "structuredDocumentation": true
  },
  "documentation": {
    "readme": "README.md",
    "examples": "thoughts/research/2026-02-02-command-evaluation.md"
  }
}
```

### Success Criteria:

#### Automated Verification:
- [x] plugin.json exists: `test -f plugin.json`
- [x] Valid JSON: `python3 -m json.tool plugin.json > /dev/null`
- [x] Contains required fields: `grep -q '"name".*"context-focused-claude"' plugin.json`
- [x] Agents directory specified: `grep -q '"agents"' plugin.json`

#### Manual Verification:
- [ ] plugin.json format matches Claude Code plugin specification
- [ ] All fields are accurate

---

## Phase 8: Git Initial Commit

### Overview
Commit all changes with proper git structure.

### Changes Required:

#### 1. Create .gitignore

**File**: `.gitignore`

**Content**:
```
# Claude Code session files
.claude/
*.local.md

# OS files
.DS_Store
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo
*~

# Logs
*.log

# Temporary files
tmp/
temp/
```

#### 2. Stage and Commit All Files

**Commands**:
```bash
git add .
git commit -m "Initial commit: Context-focused Claude plugin

Independent fork adapted from humanlayer project.

Changes:
- Removed 15 humanlayer-specific commands
- Adapted handoff system (removed sync dependencies)
- Adapted planning system (made TodoWrite optional)
- Adapted PR description commands (removed gh CLI, use pure git)
- Adapted research commands (removed humanlayer integrations)
- Restructured thoughts/ directory (removed shared/ level)
- Created plugin.json manifest
- Initialized git repository

Core features:
- 6 specialized research agents (codebase + thoughts + web)
- Parallel sub-agent architecture for context management
- Structured documentation with YAML frontmatter
- Commands: research, planning, handoff, git workflow
- Zero external dependencies (git-only)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### Success Criteria:

#### Automated Verification:
- [ ] .gitignore exists: `test -f .gitignore`
- [ ] All files staged: `git diff --cached --name-only | wc -l` (should show files)
- [ ] Clean working tree: `git status --porcelain | wc -l` (should be 0 after commit)
- [ ] Commit exists: `git log --oneline | wc -l` (should be 1)

#### Manual Verification:
- [ ] Review git status before commit
- [ ] Verify commit message is accurate
- [ ] Confirm all intended files are tracked

---

### Success Criteria:

#### Automated Verification:
- [ ] All agents still exist: `ls agents/*.md | wc -l` (should be 6)
- [ ] Expected commands exist: `ls commands/*.md | wc -l` (should be 10)
- [ ] Plugin manifest valid: `test -f plugin.json && python3 -m json.tool plugin.json > /dev/null`
- [ ] Git repo clean: `git status --porcelain | wc -l` (should be 0)
- [ ] Directory structure correct: `test -d thoughts/research && test -d thoughts/plans && test -d thoughts/handoffs`

#### Manual Verification:
- [ ] Research command creates documents in correct location
- [ ] Planning command works without TodoWrite errors
- [ ] Handoff command generates inline metadata
- [ ] Commit command includes thoughts/ directory
- [ ] No humanlayer or gh CLI errors in any command
- [ ] Plugin loads in Claude Code without errors

---

## Migration Notes

**For Existing Users**:
- Move any existing documents from `thoughts/shared/{research,plans,handoffs}/` to `thoughts/{research,plans,handoffs}/`
- Update any custom scripts that reference old paths
- Remove any humanlayer CLI tools if installed
- Verify gh CLI is not required (use git directly)

**Git History**:
- This plan initializes a fresh git repository
- If preserving history is needed, adjust Phase 1 to use `git init` on existing history

## References

- Original evaluation: `thoughts/research/2026-02-02-command-evaluation.md`
- Research system: `commands/research_codebase_nt.md`
- Agent architecture: `agents/codebase-analyzer.md`, `agents/codebase-locator.md`, etc.
- Handoff system: `commands/create_handoff.md`, `commands/resume_handoff.md`
- Planning system: `commands/create_plan_nt.md`, `commands/implement_plan.md`

---

## Related Research

- Command evaluation research: `thoughts/research/2026-02-02-command-evaluation.md`

## Implementation Notes

**Critical Ordering**:
1. Must initialize git BEFORE removing files (to track deletions)
2. Must remove files BEFORE adapting (clean workspace)
3. Must adapt files BEFORE restructuring directories (avoid broken paths)
4. Must restructure BEFORE creating plugin.json (paths must be correct)
5. Must commit AFTER all changes (capture final state)

**Rollback Strategy**:
- Each phase is atomic and can be reverted with git
- If a phase fails, revert with `git reset --hard HEAD`
- Keep backups of original files if needed

**Testing Philosophy**:
- Automated tests verify file operations and structure
- Manual tests verify command functionality and integration
- Both are required for complete verification
