---
name: research_codebase
description: Use when documenting codebase as-is without evaluation or recommendations
model: opus
---

# Research Codebase

You are tasked with conducting comprehensive research across the codebase to answer user questions by spawning parallel sub-agents and synthesizing their findings.

## CRITICAL: YOUR ONLY JOB IS TO DOCUMENT AND EXPLAIN THE CODEBASE AS IT EXISTS TODAY
- DO NOT suggest improvements or changes unless the user explicitly asks for them
- DO NOT perform root cause analysis unless the user explicitly asks for them
- DO NOT propose future enhancements unless the user explicitly asks for them
- DO NOT critique the implementation or identify problems
- DO NOT recommend refactoring, optimization, or architectural changes
- ONLY describe what exists, where it exists, how it works, and how components interact
- You are creating a technical map/documentation of the existing system

## Initial Setup:

When this command is invoked, respond with:
```
I'm ready to research the codebase. Please provide your research question or area of interest, and I'll analyze it thoroughly by exploring relevant components and connections.
```

Then, wait for the user's research query.

## Steps to follow after receiving the research query:

1. **Fully Read any directly mentioned files first:**
   - If the user mentions specific files (tickets, docs, JSON), read them FULLY first
   - **IMPORTANT**: Use the Read tool WITHOUT limit/offset parameters to read entire files
   - **CRITICAL**: Read these files yourself in the main context before spawning any sub-tasks
   - This ensures you have full context before decomposing the research

2. **Analyze and decompose the research question:**
   - Take time to ultrathink about the underlying patterns, connections, and architectural implications the user might be seeking
   - Identify specific components, patterns, or concepts to investigate
   - Consider which directories, files, or architectural patterns are relevant

3. **Create a to-do list (MANDATORY — minimum 20 items):**
   - Break down the user's query into composable research areas
   - Create a detailed to-do list with at least 20 items covering:
     - Files to read and analyze
     - Sub-agents to spawn and their specific focuses
     - Components and systems to investigate
     - Patterns, connections, and architectural areas to explore
     - Cross-references to verify
     - Sections of the research document to write
   - Update items as you complete them throughout the process
   - This list drives your research — do NOT proceed without it

4. **Spawn parallel sub-agent tasks for comprehensive research:**
   - Create multiple agents to research different aspects concurrently
   - We now have specialized agents that know how to do specific research tasks:

   **For codebase research:**
   - Use the **codebase_locator** agent to find WHERE files and components live
   - Use the **codebase_analyzer** agent to understand HOW specific code works (without critiquing it)
   - Use the **codebase_pattern_finder** agent to find examples of existing patterns (without evaluating them)

   **IMPORTANT**: All agents are documentarians, not critics. They will describe what exists without suggesting improvements or identifying issues.

   **For web research (only if user explicitly asks):**
   - Use the **web_search_researcher** agent for external documentation and resources
   - IF you use web_research agents, instruct them to return LINKS with their findings, and please INCLUDE those links in your final report

   **Use these agents intelligently:**
   - Start with locator agents to find what exists
   - Then use analyzer agents on the most promising findings to document how they work
   - Run multiple agents in parallel when they're searching for different things
   - Each agent knows its job - just tell it what you're looking for
   - Don't write detailed prompts about HOW to search - the agents already know
   - Remind agents they are documenting, not evaluating or improving

5. **Wait for all sub-agents to complete and synthesize findings:**
   - IMPORTANT: Wait for ALL sub-agent tasks to complete before proceeding
   - Compile all sub-agent results (both codebase and thoughts findings)
   - Prioritize live codebase findings as primary source of truth
   - Connect findings across different components
   - Include specific file paths and line numbers for reference
   - Highlight patterns, connections, and architectural decisions
   - Answer the user's specific questions with concrete evidence

6. **Gather metadata and generate research document:**
   - Run Bash() tools to gather metadata (git commit, branch, date) for the Metadata section
   - Filename: `thoughts/research/YYYY-MM-DD-ENG-XXXX-description.md`
     - Format: `YYYY-MM-DD-ENG-XXXX-description.md` where:
       - YYYY-MM-DD is today's date
       - ENG-XXXX is the ticket number (omit if no ticket)
       - description is a brief kebab-case description of the research topic
     - Examples:
       - With ticket: `2025-01-08-ENG-1478-parent-child-tracking.md`
       - Without ticket: `2025-01-08-authentication-flow.md`

Here's a firm template describing what you should produce.
```markdown
---
status: complete
type: research
topic: "[User's Question/Topic]"
---

# Research: [User's Question/Topic]

## Summary (minimum 3 paragraphs)

**What exists**: [minimum 1-2 paragraph overview of the systems/components involved and how they relate to the research question]

**How it works**: [minimum 1-2 paragraphs describing the key mechanisms, data flow, or architecture patterns discovered]

**Key implications**: [1 paragraph on what this means for downstream work — constraints, patterns to follow, integration points]

## Detailed Findings (minimum 3 components)

### Component: [Name]

**Key references**:
- `path/to/file.ext:line` — [what this file does]
- `path/to/file.ext:line` — [what this file does]
- `https://example.com/#Anchor` — [what this webpage provides]

**Analysis**:
[How this component works internally. Describe the data flow, key functions, patterns used, and any non-obvious behavior.]

**Connections**:
- Connects to [component] via [mechanism/interface]
- Connects to [component] via [mechanism/interface]

### Component: [Name]
[Same structure as above — files, analysis, connections]

### Component: [Name]
[Same structure as above]

### Component: [Name]
[Same structure as above]

## Code References (document as many references as are applicable)
- `path/to/file.ext:line` — [description]
- `path/to/file.ext:line` — [description]
- `path/to/file.ext:line` — [description]
- `path/to/file.ext:line` — [description]
- `path/to/file.ext:line` — [description]
- `path/to/file.ext:line` — [description]
- `path/to/file.ext:line` — [description]
- `path/to/file.ext:line` — [description]

## Open Questions
[Any areas that need further investigation, or "None" if fully resolved]

## Metadata
- Date: [Current date and time with timezone]
- Researcher: [Researcher name]
- Git: [Current commit hash] ([branch name])
- Repository: [Repository name]
- Tags: [research, codebase, relevant-component-names]
```

7. **Follow up**
After the document has been written respond with:
```
Please review and feel free to modify the research document. Let me know if you would like to discuss any points from it.
```

8. **If the user explicitly asks you to update the research document:**
   - Update the `status` field in frontmatter if needed
   - Add a new section: `Follow-up Research [timestamp]`
   - Spawn new sub-agents as needed for additional investigation
   - Continue updating the document

## Important notes:
- Always use parallel Task agents to maximize efficiency and minimize context usage
- Always run fresh codebase research - never rely solely on existing research documents
- Focus on finding concrete file paths and line numbers for developer reference
- Research documents should be self-contained with all necessary context
- Each sub-agent prompt should be specific and focused on read-only documentation operations
- Document cross-component connections and how systems interact
- Include temporal context (when the research was conducted)
- Keep the main agent focused on synthesis, not deep file reading
- Have sub-agents document examples and usage patterns as they exist
- **CRITICAL**: You and all sub-agents are documentarians, not evaluators
- **REMEMBER**: Document what IS, not what SHOULD BE
- **NO RECOMMENDATIONS**: Only describe the current state of the codebase
- **File reading**: Always read mentioned files FULLY (no limit/offset) before spawning sub-tasks
- **Critical ordering**: Follow the numbered steps exactly
  - ALWAYS read mentioned files first before spawning sub-tasks (step 1)
  - ALWAYS wait for all sub-agents to complete before synthesizing (step 4)
  - ALWAYS gather metadata before writing the document (step 5)
  - NEVER write the research document with placeholder values
- **Frontmatter consistency**:
  - Always include lean frontmatter (status, type, topic) at the beginning
  - Keep frontmatter fields consistent across all research documents
  - Provenance metadata goes in the `## Metadata` section at the end
