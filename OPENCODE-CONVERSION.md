# OpenCode Agent Conversion

Your Claude Code agents have been successfully converted to OpenCode format!

## What Was Done

All 6 agents have been converted and copied to `~/.config/opencode/agents/`:

- ✓ codebase-analyzer.md
- ✓ codebase-locator.md  
- ✓ codebase-pattern-finder.md
- ✓ thoughts-analyzer.md
- ✓ thoughts-locator.md
- ✓ web-search-researcher.md

## How to Use Your Custom Agents

### 1. In the OpenCode TUI

When you're in an OpenCode session, you can invoke your custom agents by:

1. **@ Mention**: Type `@` and you'll see an autocomplete menu with all available agents, including your custom ones:
   ```
   @codebase-analyzer help me understand how authentication works
   ```

2. **Tab to Switch**: While your custom agents are subagents (not primary agents), they can be invoked by the Build or Plan agents automatically when needed.

### 2. Agent Descriptions

Your agents will be available with these descriptions:

- **codebase-analyzer**: Analyzes codebase implementation details
- **codebase-locator**: Locates files, directories, and components  
- **codebase-pattern-finder**: Finds similar implementations and usage patterns
- **thoughts-analyzer**: Deep dive research on topics in thoughts directory
- **thoughts-locator**: Discovers relevant documents in thoughts directory
- **web-search-researcher**: Researches modern information from the web

## Conversion Details

### Tool Mapping

Claude Code tools were mapped to OpenCode tools:
- `Read` → `read: true`
- `Grep` → `grep: true`
- `Glob` → `glob: true`
- `LS` → `bash: true`
- `WebSearch` → `websearch: true`
- etc.

### Model Mapping

Models were converted to OpenCode format:
- `sonnet` → `anthropic/claude-sonnet-4-20250514`
- `haiku` → `anthropic/claude-haiku-4-20250514`
- `opus` → `anthropic/claude-opus-4-20250514`

### Agent Mode

All agents were set to `mode: subagent`, which means they can be:
- Invoked manually via `@mention`
- Called automatically by primary agents (Build/Plan) via the Task tool
- Used in parallel for research and analysis tasks

## Re-running the Conversion

If you update your Claude Code agents and want to re-convert them:

```bash
cd /home/ty/Projects/mine/context-management-plugins
node convert-agents-to-opencode.js
```

This will overwrite the existing converted agents in `~/.config/opencode/agents/`.

### Convert to a Different Location

You can specify custom input and output directories:

```bash
node convert-agents-to-opencode.js /path/to/claude-agents /path/to/output
```

## Differences Between Claude Code and OpenCode

### Key Format Changes

1. **Frontmatter Structure**:
   - Claude Code uses flat key-value pairs
   - OpenCode uses nested YAML for tools and permissions

2. **Tool Configuration**:
   - Claude Code: `tools: Read, Grep, Glob`
   - OpenCode: `tools:\n  read: true\n  grep: true\n  glob: true`

3. **Model Names**:
   - Claude Code: `model: sonnet`
   - OpenCode: `model: anthropic/claude-sonnet-4-20250514`

4. **Agent Name**:
   - Claude Code: Specified in frontmatter as `name: xyz`
   - OpenCode: Derived from filename (xyz.md → agent name "xyz")

### Behavioral Differences

1. **Invocation**:
   - Claude Code: Agents are invoked via the Task tool or auto-triggered
   - OpenCode: Agents can be @ mentioned OR invoked via Task tool

2. **Visibility**:
   - OpenCode supports `hidden: true` to hide agents from autocomplete
   - Your converted agents are all visible by default

3. **Permissions**:
   - OpenCode has a more granular permission system
   - You can set permissions like `permission.bash: { "git *": "ask" }`

## Next Steps

1. **Test Your Agents**: Open OpenCode in a project and try invoking one of your agents:
   ```
   opencode
   @codebase-analyzer show me how the API endpoints are structured
   ```

2. **Customize Further**: You can edit the agents in `~/.config/opencode/agents/` to:
   - Adjust tool permissions
   - Change model assignments
   - Add permission rules
   - Customize prompts

3. **Create Project-Specific Agents**: You can also create agents per-project by placing them in `.opencode/agents/` within your project directory.

## Troubleshooting

### Agent Not Showing in Autocomplete

1. Check that the file is in `~/.config/opencode/agents/`
2. Ensure the frontmatter has `mode: subagent`
3. Make sure `hidden: true` is not set
4. Restart OpenCode

### Agent Not Working as Expected

1. Check the tool permissions - make sure the required tools are enabled
2. Verify the model is correctly specified
3. Check OpenCode logs for errors

### Want to Use Different Models

Edit the agent file and change the model:
```yaml
model: anthropic/claude-opus-4-20250514
```

Run `opencode models` to see all available models.

## Questions?

- OpenCode Docs: https://opencode.ai/docs/agents/
- OpenCode Discord: https://opencode.ai/discord
- OpenCode GitHub: https://github.com/anomalyco/opencode
