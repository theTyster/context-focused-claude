# Context-Focused Claude

A Claude Code plugin that implements the [Advanced Context Engineering for Coding Agents](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents) (ACE-FCA) methodology through specialized sub-agents and structured workflows.

Works best in brownfield code bases or when constructing a complex context window is important.

## Plugin Values

This plugin treats LLMs as pure, stateless, reducer functions. The objective of this plugin is to optimize a workflow by creating distinct phases for human interaction, and clear, linear operations for LLMs.

## Implementation looks like this:

1. **Research**

```
/research_codebase "What does {COMPONENT} do?"
```

2. **Review Research**

- Always read the summary
- Included right files?
- Analysis is accurate?
- Do open questions point to more needed context?

2.5 **More Research?**

```
/research_codebase "What documentation exists for {library} that {COMPONENT} uses?"

Here's some pre-existing research:
@thoughts/research/{new_research_document}.md
```

---

3. **Planning**

```
/create_plan @thoughts/research/{new_research_document_with_library_context}.md
```

4. **Review Plan**

- Does this solve the issue?
- Does this plan creep out of scope?
- Does it provide all necessary context?
- Does it provide any distracting context?
- What does it intend to modify?
- How does this plan intend to verify the implementation is successful?

--- 

5. **Implement the Plan**

```
/implement_plan @thoughts/plans/{new_plan}.md
```

6. **Validate the Plan**

```
/validate_plan @thoughts/plans/{new_plan}.md
```

## Installation

Install from the Claude Code plugin marketplace:

```bash
claude plugin add context-management
```

Or install directly from this repository:

```bash
claude plugin add /path/to/context-focused-claude
```

## What It Provides

### Skills (Slash Commands)

Skills are full-context slash commands that orchestrate complex workflows. They have access to all tools.

| Skill             | Command            | Purpose                                                                                |
| ----------------- | ------------------ | -------------------------------------------------------------------------------------- |
| research_codebase | /research_codebase | Documents the codebase as-is using parallel sub-agents and compact, structured output  |
| create_plan       | /create_plan       | Autonomously creates detailed implementation plans through parallel sub-agent research |
| implement_plan    | /implement_plan    | Executes approved plans phase-by-phase with verification checkpoints                   |
| validate_plan     | /validate_plan     | Validates a newly implemented plan by running through the plans validation steps       |
| create_handoff    | /create_handoff    | Creates a structured handoff document (500–5000 tokens) for session transfer           |
| resume_handoff    | /resume_handoff    | Resumes work from a handoff document with state validation                             |

### Agents (Constrained Sub-Agents)

Agents are specialized sub-agents with limited tool access. They run in isolated context to avoid polluting your main conversation. Invoke them using the `Task` tool with the appropriate `subagent_type`.

| Agent                   | Purpose                                                              | Tools                                                |
| ----------------------- | -------------------------------------------------------------------- | ---------------------------------------------------- |
| codebase_locator        | Finds WHERE code lives — files, directories, components              | Grep, Glob, LS                                       |
| codebase_analyzer       | Analyzes HOW code works — traces data flow, documents implementation | Read, Grep, Glob, LS                                 |
| codebase_pattern_finder | Finds similar implementations and code patterns with actual snippets | Grep, Glob, Read, LS                                 |
| thoughts_locator        | Discovers relevant documents in the thoughts/ directory              | Grep, Glob, LS                                       |
| thoughts_analyzer       | Extracts high-value insights from thoughts/ documents                | Read, Grep, Glob, LS                                 |
| thoughts_writer         | Writes content verbatim to the thoughts/ directory                   | Write, Edit, Read, Glob, LS                          |
| web_search_researcher   | Researches questions using web search and page fetching              | WebSearch, WebFetch, TodoWrite, Read, Grep, Glob, LS |


Almost all codebase agents are **documentarians, not critics** — they describe what exists without suggesting improvements or identifying problems.

The `thoughts_writer` agent is unique: it is a **document assembler** with write access, used by skills to persist documents to the `thoughts/` directory.


### Typical Workflow

1. **Research** — `/research_codebase` to understand the current state
2. **Plan** — `/create_plan` to design an implementation approach
3. **Implement** — `/implement_plan` to execute the plan phase-by-phase
4. **Validate** — `/validate_plan` to verify the implementation
5. **Handoff** — `/create_handoff` if your session is getting long; `/resume_handoff` in a new session

## Conversion Tools

This project includes scripts to convert agents and skills to other AI coding tool formats.

### OpenCode

```bash
npm run convert:oc          # Convert both agents and skills
npm run convert:oc:agents   # Convert agents only
npm run convert:oc:skills   # Convert skills only
```

Output goes to `.opencode/agents/`.

### Gemini CLI

```bash
npm run convert:gemini          # Convert both agents and skills
npm run convert:gemini:agents   # Convert agents only
npm run convert:gemini:skills   # Convert skills only
```

Output goes to `.gemini/agents/` and `.gemini/skills/`.

### Direct Usage

```bash
node convert-claude-plugins-to-opencode.js [--type=agents|skills|all] [input-dir] [output-dir]
node convert-to-gemini.js [--type=agents|skills|all] [input-dir] [output-dir]
```
