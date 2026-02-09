#!/usr/bin/env node

/**
 * Convert Claude Code agents and skills to OpenCode format
 *
 * Usage:
 *   node convert-claude-plugins-to-opencode.js [--type=agents|skills|all] [input-dir] [output-dir]
 *
 * Options:
 *   --type=agents   Convert agents only (default)
 *   --type=skills   Convert skills only
 *   --type=all      Convert both agents and skills
 *
 * Defaults:
 *   input-dir: ./agents (for agents) or ./skills (for skills)
 *   output-dir: ~/.config/opencode/agents
 *
 * Skills vs Agents:
 *   - Agents have limited tool access (specified in frontmatter)
 *   - Skills have full tool access (all tools enabled)
 *   - Skills are located in ./skills/<name>/SKILL.md
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Tool name mappings
const TOOL_MAPPING = {
  'Read': 'read',
  'Write': 'write',
  'Edit': 'edit',
  'Bash': 'bash',
  'Grep': 'grep',
  'Glob': 'glob',
  'LS': 'list', // LS maps to OpenCode's list tool
  'WebSearch': 'websearch',
  'WebFetch': 'webfetch',
  'Task': 'task',
  'TodoWrite': 'todowrite',
  'TodoRead': 'todoread'
};

// Model mappings
const MODEL_MAPPING = {
  'sonnet': 'anthropic/claude-sonnet-4-20250514',
  'claude-sonnet': 'anthropic/claude-sonnet-4-20250514',
  'haiku': 'anthropic/claude-haiku-4-20250514',
  'claude-haiku': 'anthropic/claude-haiku-4-20250514',
  'opus': 'anthropic/claude-opus-4-20250514',
  'claude-opus': 'anthropic/claude-opus-4-20250514'
};

function parseClaudeCodeAgent(content) {
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!frontmatterMatch) {
    throw new Error('Invalid agent format: no frontmatter found');
  }
  
  const [, frontmatter, body] = frontmatterMatch;
  const metadata = {};
  
  // Parse YAML-like frontmatter
  frontmatter.split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      metadata[match[1]] = match[2].trim();
    }
  });
  
  return { metadata, body: body.trim() };
}

function convertTools(toolsString) {
  if (!toolsString) return {};

  const tools = {};
  const toolList = toolsString.split(',').map(t => t.trim());

  // Set all tools to false by default (read-only access)
  Object.values(TOOL_MAPPING).forEach(tool => {
    tools[tool] = false;
  });

  // Enable only the tools specified
  toolList.forEach(tool => {
    const opencodeTool = TOOL_MAPPING[tool];
    if (opencodeTool) {
      tools[opencodeTool] = true;
    }
  });

  return tools;
}

function getAllToolsEnabled() {
  const tools = {};
  const uniqueTools = [...new Set(Object.values(TOOL_MAPPING))];
  uniqueTools.forEach(tool => {
    tools[tool] = true;
  });
  return tools;
}

function parseClaudeCodeSkill(content, skillName) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    throw new Error('Invalid skill format: no frontmatter found');
  }
  const [, frontmatter, body] = frontmatterMatch;
  const metadata = {};
  frontmatter.split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      metadata[match[1]] = match[2].trim();
    }
  });
  if (!metadata.name) {
    metadata.name = skillName;
  }
  return { metadata, body: body.trim() };
}

// Slash command to @mention mappings (longest match first to avoid clobbering)
const SLASH_TO_MENTION = [
  ['/create_plan_interactively', '@create_plan_interactively'],
  ['/research_codebase', '@research_codebase'],
  ['/implement_plan', '@implement_plan'],
  ['/validate_plan', '@validate_plan'],
  ['/resume_handoff', '@resume_handoff'],
  ['/create_handoff', '@create_handoff'],
  ['/create_plan', '@create_plan'],
  ['/mega_ralph', '@mega_ralph'],
  ['/describe_pr', '@describe_pr'],
  ['/commit', '@commit'],
];

function transformBodyForOpenCode(body) {
  let result = body;

  // Replace slash commands with @mentions (longest match first)
  for (const [slash, mention] of SLASH_TO_MENTION) {
    result = result.split(slash).join(mention);
  }

  // Replace backtick-wrapped tool names using TOOL_MAPPING
  for (const [claudeName, opencodeName] of Object.entries(TOOL_MAPPING)) {
    const pattern = new RegExp('`' + claudeName + '`', 'g');
    result = result.replace(pattern, '`' + opencodeName + '`');
  }

  return result;
}

function convertSkillToOpenCodeFormat(skill) {
  const { metadata, body } = skill;
  const mode = metadata.name === 'mega_ralph' ? 'primary' : 'subagent';
  let yaml = '---\n';
  yaml += `description: ${metadata.description}\n`;
  yaml += `mode: ${mode}\n`;

  yaml += 'tools:\n';
  const tools = getAllToolsEnabled();
  Object.entries(tools).forEach(([tool, enabled]) => {
    yaml += `  ${tool}: ${enabled}\n`;
  });
  yaml += '---\n\n';
  return yaml + transformBodyForOpenCode(body);
}

function convertModel(modelString) {
  if (!modelString) return undefined;
  
  const normalized = modelString.toLowerCase().trim();
  return MODEL_MAPPING[normalized] || modelString;
}

function convertToOpenCodeFormat(claudeAgent) {
  const { metadata, body } = claudeAgent;
  
  const opencodeFrontmatter = {
    description: metadata.description,
    mode: 'subagent', // All Claude Code agents are subagents in OpenCode
  };
  
  // Add tools configuration
  if (metadata.tools) {
    opencodeFrontmatter.tools = convertTools(metadata.tools);
  }
  
  // Build YAML frontmatter
  let yaml = '---\n';
  yaml += `description: ${opencodeFrontmatter.description}\n`;
  yaml += `mode: ${opencodeFrontmatter.mode}\n`;

  if (opencodeFrontmatter.tools && Object.keys(opencodeFrontmatter.tools).length > 0) {
    yaml += 'tools:\n';
    Object.entries(opencodeFrontmatter.tools).forEach(([tool, enabled]) => {
      yaml += `  ${tool}: ${enabled}\n`;
    });
  }
  
  yaml += '---\n\n';

  return yaml + transformBodyForOpenCode(body);
}

function convertFile(inputPath, outputPath) {
  console.log(`Converting: ${path.basename(inputPath)}`);

  try {
    const content = fs.readFileSync(inputPath, 'utf8');
    const claudeAgent = parseClaudeCodeAgent(content);
    const opencodeContent = convertToOpenCodeFormat(claudeAgent);

    fs.writeFileSync(outputPath, opencodeContent, 'utf8');
    console.log(`  ✓ Saved to: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return false;
  }
}

function discoverSkills(skillsDir) {
  const skills = [];
  if (!fs.existsSync(skillsDir)) return skills;

  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  entries.forEach(entry => {
    if (entry.isDirectory()) {
      const skillPath = path.join(skillsDir, entry.name, 'SKILL.md');
      if (fs.existsSync(skillPath)) {
        skills.push({ name: entry.name, path: skillPath });
      }
    }
  });
  return skills;
}

function convertSkillFile(skill, outputDir) {
  console.log(`Converting skill: ${skill.name}`);
  try {
    const content = fs.readFileSync(skill.path, 'utf8');
    const parsedSkill = parseClaudeCodeSkill(content, skill.name);
    const opencodeContent = convertSkillToOpenCodeFormat(parsedSkill);
    const outputPath = path.join(outputDir, `${skill.name}.md`);
    fs.writeFileSync(outputPath, opencodeContent, 'utf8');
    console.log(`  ✓ Saved to: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return false;
  }
}

function convertAgents(agentsDir, outputDir) {
  console.log(`\n--- Converting Agents ---`);
  console.log(`Input directory: ${agentsDir}\n`);
  let success = 0, fail = 0;
  if (!fs.existsSync(agentsDir)) {
    console.log(`Agents directory not found: ${agentsDir}`);
    return { success, fail };
  }
  const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
  if (files.length === 0) {
    console.log('No agent files found.');
    return { success, fail };
  }
  console.log(`Found ${files.length} agent(s) to convert:\n`);
  files.forEach(file => {
    if (convertFile(path.join(agentsDir, file), path.join(outputDir, file))) success++;
    else fail++;
  });
  return { success, fail };
}

function convertSkills(skillsDir, outputDir) {
  console.log(`\n--- Converting Skills ---`);
  console.log(`Input directory: ${skillsDir}\n`);
  let success = 0, fail = 0;
  const skills = discoverSkills(skillsDir);
  if (skills.length === 0) {
    console.log('No skills found.');
    return { success, fail };
  }
  console.log(`Found ${skills.length} skill(s) to convert:\n`);
  skills.forEach(skill => {
    if (convertSkillFile(skill, outputDir)) success++;
    else fail++;
  });
  return { success, fail };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = { type: 'agents', inputDir: null, outputDir: null };
  args.forEach(arg => {
    if (arg.startsWith('--type=')) {
      options.type = arg.split('=')[1];
    } else if (!arg.startsWith('--')) {
      if (!options.inputDir) options.inputDir = arg;
      else if (!options.outputDir) options.outputDir = arg;
    }
  });
  return options;
}

function main() {
  const options = parseArgs();
  const validTypes = ['agents', 'skills', 'all'];
  if (!validTypes.includes(options.type)) {
    console.error(`Error: Invalid type "${options.type}". Must be one of: ${validTypes.join(', ')}`);
    process.exit(1);
  }

  const outputDir = options.outputDir || path.join(__dirname, '.opencode', 'agents');
  console.log('Claude Code to OpenCode Converter');
  console.log('==================================\n');
  console.log(`Conversion type: ${options.type}`);
  console.log(`Output directory: ${outputDir}\n`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let totalSuccess = 0, totalFail = 0;

  if (options.type === 'agents' || options.type === 'all') {
    const agentsDir = options.inputDir || path.join(__dirname, 'agents');
    const r = convertAgents(agentsDir, outputDir);
    totalSuccess += r.success; totalFail += r.fail;
  }

  if (options.type === 'skills' || options.type === 'all') {
    const skillsDir = options.inputDir || path.join(__dirname, 'skills');
    const r = convertSkills(skillsDir, outputDir);
    totalSuccess += r.success; totalFail += r.fail;
  }

  console.log(`\n==================================`);
  console.log(`Conversion complete! ✓ ${totalSuccess}, ✗ ${totalFail}`);
  console.log(`\nConverted items are in: ${outputDir}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  parseClaudeCodeAgent,
  parseClaudeCodeSkill,
  convertToOpenCodeFormat,
  convertSkillToOpenCodeFormat,
  convertTools,
  convertModel,
  getAllToolsEnabled,
  discoverSkills,
  transformBodyForOpenCode
};
