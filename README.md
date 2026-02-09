# Context-Focused Claude

Independent context-management system for Claude Code using parallel sub-agents and structured documentation.

## Overview

Context-Focused Claude provides intelligent context management through parallel sub-agents and structured documentation. It helps you create detailed implementation plans, research codebases efficiently, manage work handoffs between sessions, and maintain organized documentation in a `thoughts/` directory structure.

## Features

- **Autonomous Planning**: Create detailed implementation plans through thorough research without user interaction
- **Parallel Research**: Use specialized sub-agents to research codebase efficiently in parallel
- **Work Handoffs**: Create and resume work from structured handoff documents between sessions
- **PR Descriptions**: Generate comprehensive pull request descriptions following repository templates
- **Commit Messages**: Create consistent, well-formatted commit messages
- **Plan Validation**: Validate implementations against plans with automated and manual verification

## Installation

```bash
cc plugin add https://github.com/yourusername/context-focused-claude
```

## Components

### Skills (8 total)

The plugin includes 8 specialized skills:

- **mega_ralph**: Orchestrates autonomous development workflow from research through implementation with validation and failure recovery
- **create_plan**: Enables an autonomous agent to perform thorough codebase research and generate a detailed, actionable implementation plan for other sub-agents to execute.
- **create_plan_interactively**: Generates detailed, phased implementation plans by conducting thorough codebase research and iteratively collaborating with a user to define a clear and verifiable engineering approach.
- **implement_plan**: Executes phased technical plans by implementing the specified code changes and verifying the success criteria for each step.
- **validate_plan**: Validates a software implementation against its development plan, verifies success criteria, and identifies any deviations or potential issues.
- **create_handoff**: Creates a structured markdown document summarizing the current work session, including tasks, recent changes, and next steps, to enable a seamless handoff to another agent.
- **resume_handoff**: Interactively resumes a task by reading a specified handoff document, analyzing its context, verifying the current state of the codebase against the document's claims, and creating an action plan to continue the work.
- **research_codebase**: Researches and documents the current state of a codebase in response to a user's query by spawning parallel sub-agents and synthesizing their findings into a purely descriptive technical report.

### Agents (6 total)

Specialized sub-agents for autonomous tasks:

- **codebase_analyzer**: Analyzes implementation details and technical workings
- **codebase_locator**: Locates files, directories, and components relevant to features
- **codebase_pattern_finder**: Finds similar implementations and usage patterns
- **thoughts_analyzer**: Deep dive research on topics in thoughts directory
- **thoughts_locator**: Discovers relevant documents in thoughts directory
- **web_search_researcher**: Researches modern information from the web

## Usage

### Autonomous Development Workflow (mega_ralph)

For complete end-to-end autonomous development:

```bash
/mega_ralph Add rate limiting to API endpoints
```

The skill will automatically:
1. **Research**: Spawn parallel sub-agents to understand the codebase
2. **Plan**: Create a detailed, phased implementation plan
3. **Implement**: Execute each phase with automated verification
4. **Validate**: Run comprehensive validation checks
5. **Recover**: Create handoff documents on failure for session restart

Resume from a failure handoff:
```bash
/mega_ralph thoughts/handoffs/2026-02-05_10-30-00_mega-ralph-feature.md
```

### Creating an Implementation Plan

When you need to plan a feature implementation:

```
Claude will automatically use the create_plan skill when appropriate
```

The skill will:
1. Research the codebase using parallel sub-agents
2. Analyze existing patterns and architecture
3. Create a detailed, actionable implementation plan
4. Save the plan to `thoughts/plans/`

### Managing Work Handoffs

When ending a work session:

```
Claude will create handoff documents automatically when appropriate
```

When resuming work:

```
Resume from the handoff document in thoughts/handoffs/
```

## Directory Structure

The plugin creates and maintains a `thoughts/` directory structure:

```
thoughts/
├── plans/          # Implementation plans
├── research/       # Research documents and findings
├── handoffs/       # Session handoff documents
└── tickets/        # Issue and ticket analysis
```

## OpenCode Conversion

If you use [OpenCode](https://opencode.ai), you can convert this plugin's agents and skills to OpenCode format.

### Prerequisites

You need Node.js installed on your system. To check if you have it:

```bash
node --version
```

If you see a version number (like `v20.10.0`), you're good to go. If not, install Node.js from [nodejs.org](https://nodejs.org) (download the LTS version).

### Running the Conversion

1. **Open a terminal** and navigate to where you cloned this repository:
   ```bash
   cd /path/to/context-management-plugins
   ```

2. **Run the conversion script** using one of these commands:

   ```bash
   # Convert agents only (6 agents with limited tool access)
   node convert-claude-plugins-to-opencode.js

   # Convert skills only (8 skills with full tool access)
   node convert-claude-plugins-to-opencode.js --type=skills

   # Convert both agents and skills (recommended)
   node convert-claude-plugins-to-opencode.js --type=all
   ```

3. **Copy to global config** so agents are available in all OpenCode projects:

   ```bash
   cp .opencode/agents/*.md ~/.config/opencode/agents/
   ```

   The converted files are also kept in `./.opencode/agents/` (in-repo, version-controllable). The project-local copy works when OpenCode is launched from this directory; the global copy at `~/.config/opencode/agents/` makes them available everywhere.

### What Gets Converted

| Type | Count | Tool Access | OpenCode Mode | Source Location |
|------|-------|-------------|---------------|-----------------|
| Skills | 8 | Full (all tools enabled) | `primary` (tab switcher) | `./skills/*/SKILL.md` |
| Agents | 6 | Limited (read-only research) | `subagent` (task-spawned) | `./agents/*.md` |

Skills become **primary agents** — they appear in the OpenCode tab switcher and are invoked via `@agent_name`. Agents become **subagents** — they are spawned by other agents via the `task` tool.

### Using in OpenCode

After conversion, invoke primary agents in OpenCode by typing `@` followed by the agent name:

```
@mega_ralph Add rate limiting to API endpoints
@create_plan implement user profile editing
@research_codebase explain how authentication works in this project
```

### Custom Output Location

To save converted files to a different location:

```bash
node convert-claude-plugins-to-opencode.js --type=all ./agents /custom/output/path
```
