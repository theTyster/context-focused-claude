---
date: 2026-02-02 14:00:51 CST
researcher: ty
git_commit: N/A (not a git repository)
branch: N/A
repository: context-focused-claude
topic: "Command Evaluation: Which to Keep and Which to Adapt"
tags: [research, commands, context-management, evaluation]
status: complete
last_updated: 2026-02-02
last_updated_by: ty
---

# Research: Command Evaluation for Context-Focused Claude Fork

**Date**: 2026-02-02 14:00:51 CST
**Researcher**: ty
**Repository**: context-focused-claude

## Research Question

What commands from the humanlayer .claude project are worth keeping and why? Which ones need to be adapted to be independent of humanlayer-specific tools?

## Executive Summary

After comprehensive analysis of all 28 commands and 6 specialized agents, I've identified **3 core systems worth keeping** for their intentional context compaction features:

1. **Research System** (research_codebase_nt.md + 6 specialized agents) - **KEEP AS-IS** - Already independent, excellent context management
2. **Handoff System** (create_handoff.md + resume_handoff.md) - **NEEDS ADAPTATION** - Remove humanlayer sync, great context transfer mechanism
3. **Planning System** (create_plan_nt.md + iterate_plan_nt.md) - **NEEDS ADAPTATION** - Remove TodoWrite dependency, excellent interactive planning

The remaining 22 commands are either:
- Wrappers for humanlayer-specific infrastructure (ralph_*, oneshot, debug, founder_mode)
- Tools that require adaptation since they use the `gh` tool
- Integration-heavy commands requiring Linear/humanlayer MCP servers

## Detailed Findings

### Category 1: KEEP AS-IS - Core Context Management Systems

#### 1.1 Research System (HIGH VALUE - Keep)

**Commands to keep**:
- `commands/research_codebase_nt.md` (commands/research_codebase_nt.md:1-191)
- `commands/research_codebase_generic.md` (commands/research_codebase_generic.md:1-179)

**Agents to keep** (all 6):
- `agents/codebase-analyzer.md` (agents/codebase-analyzer.md:1-144)
- `agents/codebase-locator.md` (agents/codebase-locator.md:1-123)
- `agents/codebase-pattern-finder.md` (agents/codebase-pattern-finder.md:1-228)
- `agents/thoughts-analyzer.md` (agents/thoughts-analyzer.md:1-146)
- `agents/thoughts-locator.md` (agents/thoughts-locator.md:1-128)
- `agents/web-search-researcher.md` (agents/web-search-researcher.md:1-110)

**Why keep**:
- **Zero external dependencies**: All use built-in tools (Read, Grep, Glob, LS, WebSearch, WebFetch)
- **Intentional context compaction**: Spawns parallel sub-agents to distribute context load (research_codebase_nt.md:179)
- **Specialized agent architecture**: Each agent has narrow scope to minimize token usage
- **Main agent synthesis focus**: Keeps orchestrating agent out of deep file reading (research_codebase_nt.md:188)
- **Sonnet model for sub-agents**: Cost-effective model selection (all agents use sonnet)
- **Already adapted**: The "nt" (no thoughts) variant removes humanlayer dependencies

**Context management features**:
1. Pre-reads files fully before spawning sub-tasks (research_codebase_nt.md:30-34)
2. Parallel task execution to minimize context window usage
3. Structured research documents with YAML frontmatter
4. Path normalization for thoughts/searchable/ directories
5. Critical ordering to prevent placeholder values

**Adaptation needed**: Remove Humanlayer integrations from `research_codebase_generic.md`.

---

#### 1.2 Git Workflow Basics (MEDIUM VALUE - Keep with minor changes)

**Commands to keep**:
- `commands/commit.md` (commands/commit.md:1-49)
- `commands/ci_commit.md` (commands/ci_commit.md:1-40)

**Why keep**:
- **Zero external dependencies**: Git-only, no humanlayer tools
- **Simple workflow automation**: Guides commit message creation
- **User approval patterns**: commit.md requires approval, ci_commit.md for automation

**Problems and Adaptation needed**:
- Remove references to `thoughts/` directory exclusions (ci_commit.md:25-27)
- Remove references to `gh` for more typical `git` commands.
- describe_pr_nt.md saves to `/tmp/` which gets lost
- describe_pr.md requires `humanlayer thoughts sync` (describe_pr.md:59-62)

---

### Category 2: ADAPT - High Value with Dependencies

#### 2.1 Handoff System (HIGH VALUE - Needs adaptation)

**Commands**:
- `commands/create_handoff.md` (commands/create_handoff.md:1-107)
- `commands/resume_handoff.md` (commands/resume_handoff.md:1-196)

**Why keep**:
- **Excellent context transfer mechanism**: Structured approach to session continuity
- **Context compaction philosophy**: Designed to compact context without losing details (create_handoff.md:7)
- **Comprehensive documentation**: Captures tasks, learnings, artifacts, next steps
- **Interactive validation**: resume_handoff verifies state before continuing (resume_handoff.md:166-170)

**Adaptations needed**:
1. Remove `humanlayer thoughts sync` dependency (resume_handoff.md:21)
2. Remove `scripts/spec_metadata.sh` dependency (create_handoff.md:19) - generate inline
3. Simplify directory structure (just use `thoughts/handoffs/` without shared/)
4. Make TodoWrite optional or remove dependency

**After adaptation**:
- Save handoffs to `thoughts/handoffs/YYYY-MM-DD_HH-MM-SS_description.md`
- Generate metadata inline using git/date commands
- Keep the YAML frontmatter structure
- Keep the structured content sections
- Keep the validation and continuation logic

---

#### 2.2 Planning System (MEDIUM-HIGH VALUE - Needs adaptation)

**Commands**:
- `commands/create_plan_nt.md` (commands/create_plan_nt.md:1-440)
- `commands/iterate_plan_nt.md` (commands/iterate_plan_nt.md:1-239)

**Why keep**:
- **Interactive planning approach**: Skeptical questioning, step-by-step buy-in
- **Parallel research integration**: Uses specialized agents for research
- **Success criteria separation**: Automated vs manual verification
- **No open questions rule**: Forces resolution before proceeding

**Adaptations needed**:
1. Remove TodoWrite dependency (create_plan_nt.md:100, 329-333)
2. Remove references to Linear ticket integration (can be optional)
3. Simplify to `thoughts/plans/YYYY-MM-DD-description.md` path
4. Make specialized agent usage optional (graceful degradation if agents missing)

**After adaptation**:
- Keep the 5-step interactive workflow
- Keep the research task spawning patterns
- Keep the plan template structure
- Make TodoWrite optional (fallback to simple progress tracking)
- Keep the surgical edit approach in iterate_plan_nt

---

#### 2.3 Implementation Command (MEDIUM VALUE - Minimal adaptation)

**Command**:
- `commands/implement_plan.md` (commands/implement_plan.md:1-89)

**Why keep**:
- **Already independent**: No humanlayer-specific dependencies
- **Phase-by-phase execution**: Structured implementation approach
- **Checkpoint system**: Uses plan checkboxes for progress tracking
- **Verification gates**: Automated and manual testing integration

**Adaptations needed**:
1. Make TodoWrite optional (implement_plan.md:16, 48)
2. Otherwise works as-is

---

### Category 3: DO NOT KEEP - Humanlayer-Specific

#### 3.1 Ralph Commands (All humanlayer-specific)

**Commands to remove**:
- `commands/ralph_plan.md` - Requires Linear MCP + humanlayer CLI
- `commands/ralph_impl.md` - Requires `humanlayer-nightly launch` command
- `commands/ralph_research.md` - Requires Linear MCP + thoughts sync
- `commands/oneshot_plan.md` - Wrapper for ralph commands
- `commands/oneshot.md` - Requires `npx humanlayer launch`

**Why not adapt**:
- Deeply integrated with Linear workflow states
- Depend on humanlayer-specific session launching
- Require Linear MCP server with specific tools
- Automated ticket selection logic tied to Linear API
- Not worth the effort to adapt when core functionality exists elsewhere

---

#### 3.2 Worktree Commands (Marginal value)

**Commands**:
- `commands/create_worktree_implementation.md`
- `commands/create_worktree_plan.md`

**Why not keep**:
- Simple wrappers around `git worktree add`
- Main value was integration with humanlayer launch command
- Standard git worktree commands work fine
- Could be replaced with a simple bash script if needed

---

#### 3.3 Code Review Setup (Humanlayer-specific)

**Command**:
- `commands/local_review.md`

**Why not keep**:
- Requires `humanlayer thoughts init` (local_review.md:31)
- Specific to humanlayer's review workflow
- Standard git worktree + manual setup works fine

---

#### 3.4 Utility Commands (Mixed)

**Commands**:
- `commands/debug.md` - **Remove**: Humanlayer daemon-specific
- `commands/founder_mode.md` - **Remove**: Linear integration required
- `commands/linear.md` - **Remove**: Pure Linear MCP integration
- `commands/validate_plan.md` - **Consider keeping**: Independent, validates plans against implementation

**validate_plan.md** (KEEP - Low Priority):
- Already independent (validate_plan.md:1-167)
- Uses only git commands
- Validates implementation against plan
- No dependencies on humanlayer tools
- Useful for verification workflows

---

### Category 4: Keep - Research Command Variants

**Commands**:
- `commands/research_codebase.md` - Original with thoughts sync. This one can be removed.
- `commands/research_codebase_generic.md` - more lightweight version to the 'nt' variant. This one should be adapted.

**Recommendation**: **Keep** - research_codebase_nt.md is the best version
- The "nt" (no thoughts) variant already removes all humanlayer dependencies
- The "_generic" variant integrates with the `humanlayer` thoughts sync and has a more compact explanation. May be useful for one-off researches.
- Remove only `research_codebase.md`.

---

## Summary Table: Keep vs Adapt vs Remove

| Command | Verdict | Reason |
|---------|---------|--------|
| **research_codebase_nt.md** | ✅ KEEP | Core context management, zero dependencies |
| **All 6 agents/** | ✅ KEEP | Enable parallel research, already independent |
| **create_handoff.md** | 🔧 ADAPT | Excellent context transfer, needs sync removal |
| **resume_handoff.md** | 🔧 ADAPT | Session continuity, needs sync removal |
| **create_plan_nt.md** | 🔧 ADAPT | Interactive planning, needs TodoWrite removal |
| **iterate_plan_nt.md** | 🔧 ADAPT | Plan updates, needs TodoWrite removal |
| **implement_plan.md** | 🔧 ADAPT | Phase-by-phase implementation |
| **validate_plan.md** | ✅ KEEP | Plan validation, already independent |
| **commit.md** | ✅ KEEP | Git workflow, already independent |
| **ci_commit.md** | ✅ KEEP | Automated commits |
| **ralph_plan.md** | ❌ REMOVE | Linear + humanlayer CLI |
| **ralph_impl.md** | ❌ REMOVE | Humanlayer launch command |
| **ralph_research.md** | ❌ REMOVE | Linear MCP required |
| **oneshot_plan.md** | ❌ REMOVE | Wrapper for ralph commands |
| **oneshot.md** | ❌ REMOVE | Humanlayer launch required |
| **create_worktree_*.md** | ❌ REMOVE | Simple wrappers, not worth keeping |
| **local_review.md** | ❌ REMOVE | Humanlayer thoughts init |
| **describe_pr*.md** (all 3) | 🔧 ADAPT | Change gh CLI + thoughts and /tmp storage |
| **debug.md** | ❌ REMOVE | Humanlayer daemon-specific |
| **founder_mode.md** | ❌ REMOVE | Linear integration required |
| **linear.md** | ❌ REMOVE | Pure Linear MCP integration |
| **research_codebase.md** | ❌ REMOVE | Use nt variant instead |
| **research_codebase_generic.md** | 🔧 ADAPT | remove Humanlayer integrations |

---

## Final Recommendations

### Immediate Actions (Keep 9 files + adapt 5)

**Keep as-is (9 files)**:
1. `commands/research_codebase_nt.md`
2. `commands/validate_plan.md`
3. `commands/commit.md`
4. `commands/ci_commit.md`
5. `agents/codebase-analyzer.md`
6. `agents/codebase-locator.md`
7. `agents/codebase-pattern-finder.md`
8. `agents/thoughts-analyzer.md`
9. `agents/thoughts-locator.md`
10. `agents/web-search-researcher.md`

**Adapt (5 files)**:
1. `commands/create_handoff.md` - Remove sync, inline metadata
2. `commands/resume_handoff.md` - Remove sync, simplify paths
3. `commands/create_plan_nt.md` - Remove TodoWrite, keep workflow
4. `commands/iterate_plan_nt.md` - Remove TodoWrite
5. `commands/implement_plan.md` - Make TodoWrite optional
6. All describe_pr* variants (3 files)
7. `research_codebase_generic.md` - Remove humanlayer integrations

**Remove (19 files)**:
- All ralph_* commands (3 files)
- All oneshot* commands (2 files)
- All create_worktree_* commands (2 files)
- research_codebase.md
- local_review.md, debug.md, founder_mode.md, linear.md (4 files)

### Priority Order for Adaptation

**Phase 1 - Core Research** (Ready now):
- ✅ Research system already works independently
- Simplify paths to `thoughts/research/`

**Phase 2 - Handoff System** (Adaptation effort: 2-4 hours):
- Remove `humanlayer thoughts sync` calls
- Generate metadata inline with git commands
- Simplify paths to `thoughts/handoffs/`

**Phase 3 - Planning System** (Adaptation effort: 4-6 hours):
- Make TodoWrite optional (fallback to simple tracking)
- Simplify paths to `thoughts/plans/`

**Phase 4 - Implementation** (Adaptation effort: 1-2 hours):
- Make TodoWrite optional in implement_plan.md

---

## Context Management Architecture

The core value of this system is its **intentional context compaction** through:

### 1. Parallel Sub-Agent Architecture
- Main agent orchestrates, sub-agents analyze
- Each sub-agent has narrow scope (locate vs analyze vs pattern-find)
- Uses cost-effective Sonnet model for sub-agents
- Main agent stays focused on synthesis

### 2. Handoff System
- Structured context transfer between sessions
- Emphasis on file:line references over code snippets
- Validation of context before resuming
- YAML frontmatter for metadata

### 3. Planning Workflow
- Interactive buy-in at each step
- Research parallelization for discovery
- Success criteria separation
- No open questions rule

### 4. Document Structure
All systems use consistent YAML frontmatter:
```yaml
date: ISO timestamp
researcher: name
git_commit: hash
branch: branch name
repository: repo name
topic: description
tags: [relevant, tags]
status: complete
last_updated: YYYY-MM-DD
```

## Code References

- **Research system core**: commands/research_codebase_nt.md:1-191
- **Parallel agent spawning**: commands/research_codebase_nt.md:43-68
- **Context management notes**: commands/research_codebase_nt.md:165-190
- **Handoff context compaction**: commands/create_handoff.md:7, 91-94
- **Planning workflow**: commands/create_plan_nt.md:38-277
- **Implementation checkpoints**: commands/implement_plan.md:43-66

---
## Related Research

None yet - this is the first research document for this fork.
