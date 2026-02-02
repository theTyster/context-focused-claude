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

### From Local Directory

```bash
cc plugin add /home/ty/Projects/mine/context-focused-claude
```

### From Git Repository (once published)

```bash
cc plugin add https://github.com/yourusername/context-focused-claude
```

## Components

### Skills (14 total)

The plugin includes 14 specialized skills:

- **create-plan**: Autonomous implementation plan creation through thorough research
- **create-plan-nt**: Non-interactive plan creation variant
- **implement-plan**: Execute implementation plans with validation
- **validate-plan**: Validate implementations against plans
- **create-handoff**: Create structured handoff documents for session transitions
- **resume-handoff**: Resume work from handoff documents
- **describe-pr**: Generate comprehensive pull request descriptions
- **describe-pr-nt**: Non-interactive PR description variant
- **ci-describe-pr**: CI-focused PR description generation
- **commit**: Create well-formatted commit messages
- **ci-commit**: CI-focused commit message generation
- **research-codebase-generic**: General codebase research
- **research-codebase-nt**: Non-interactive codebase research

### Agents (6 total)

Specialized sub-agents for autonomous tasks:

- **codebase-analyzer**: Analyzes implementation details and technical workings
- **codebase-locator**: Locates files, directories, and components relevant to features
- **codebase-pattern-finder**: Finds similar implementations and usage patterns
- **thoughts-analyzer**: Deep dive research on topics in thoughts directory
- **thoughts-locator**: Discovers relevant documents in thoughts directory
- **web-search-researcher**: Researches modern information from the web

## Usage

### Creating an Implementation Plan

When you need to plan a feature implementation:

```
Claude will automatically use the create-plan skill when appropriate
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

### Generating PR Descriptions

When creating a pull request:

```
Claude will generate comprehensive PR descriptions following your repository's template
```

## Directory Structure

The plugin creates and maintains a `thoughts/` directory structure:

```
thoughts/
├── plans/          # Implementation plans
├── research/       # Research documents and findings
├── handoffs/       # Session handoff documents
├── pr_descriptions/# Generated PR descriptions
└── tickets/        # Issue and ticket analysis
```

## Configuration

The plugin uses these default settings (configurable in plugin.json):

- **thoughtsDirectory**: `thoughts`
- **researchSubdir**: `research`
- **plansSubdir**: `plans`
- **handoffsSubdir**: `handoffs`

## Requirements

- Claude Code v0.1.0 or higher
- Tools: Read, Write, Edit, Bash, Grep, Glob, LS, WebSearch, WebFetch, Task

## License

MIT

## Author

ty
