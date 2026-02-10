#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TOOL_MAPPING = {
  'Read': 'fs_read',
  'Write': 'fs_write',
  'Edit': 'fs_write',
  'Bash': 'execute_bash',
  'Grep': 'fs_read',
  'Glob': 'fs_read',
  'LS': 'fs_read',
  'WebSearch': 'web_search',
  'WebFetch': 'web_fetch',
  'Task': null,
  'TodoWrite': 'todo_list',
  'TodoRead': 'todo_list'
};

const MODEL_MAPPING = {
  'sonnet': 'claude-sonnet-4',
  'haiku': 'claude-haiku-4',
  'opus': 'claude-opus-4'
};

const SLASH_REPLACEMENTS = [
  ['/create_plan_interactively', 'create a plan interactively'],
  ['/research_codebase', 'research the codebase'],
  ['/implement_plan', 'implement the plan'],
  ['/validate_plan', 'validate the plan'],
  ['/resume_handoff', 'resume from a handoff'],
  ['/create_handoff', 'create a handoff'],
  ['/create_plan', 'create a plan'],
  ['/mega_ralph', 'use the mega_ralph workflow'],
];

function parseClaudeCodeFile(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('Invalid format: no frontmatter found');
  
  const [, frontmatter, body] = match;
  const metadata = {};
  
  frontmatter.split('\n').forEach(line => {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) metadata[m[1]] = m[2].trim();
  });
  
  return { metadata, body: body.trim() };
}

function convertTools(toolsString) {
  if (!toolsString) return [];
  const tools = new Set();
  toolsString.split(',').map(t => t.trim()).forEach(tool => {
    const kiroTool = TOOL_MAPPING[tool];
    if (kiroTool) tools.add(kiroTool);
  });
  return [...tools];
}

function transformPrompt(body) {
  let result = body;
  
  for (const [slash, replacement] of SLASH_REPLACEMENTS) {
    result = result.split(slash).join(replacement);
  }
  
  for (const [claudeName, kiroName] of Object.entries(TOOL_MAPPING)) {
    if (kiroName) {
      result = result.replace(new RegExp('`' + claudeName + '`', 'g'), '`' + kiroName + '`');
    }
  }
  
  result = result.replace(/spawn.*?task.*?agent/gi, 'consider researching');
  result = result.replace(/create.*?task.*?agent/gi, 'research');
  
  return result;
}

function convertToKiroFormat(parsed, isSkill, name) {
  const { metadata, body } = parsed;
  const kiroAgent = {
    name: name,
    description: metadata.description,
    prompt: transformPrompt(body),
    tools: isSkill ? ['fs_read', 'fs_write', 'execute_bash', 'web_search', 'web_fetch', 'todo_list'] : convertTools(metadata.tools),
    allowedTools: ['fs_read']
  };
  
  if (metadata.model) {
    const mapped = MODEL_MAPPING[metadata.model.toLowerCase()];
    if (mapped) kiroAgent.model = mapped;
  }
  
  return kiroAgent;
}

function convertFile(inputPath, outputPath, isSkill) {
  console.log(`Converting: ${path.basename(inputPath)}`);
  try {
    const content = fs.readFileSync(inputPath, 'utf8');
    const parsed = parseClaudeCodeFile(content);
    const name = path.basename(outputPath, '.json');
    const kiroAgent = convertToKiroFormat(parsed, isSkill, name);
    fs.writeFileSync(outputPath, JSON.stringify(kiroAgent, null, 2), 'utf8');
    console.log(`  ✓ ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`  ✗ ${error.message}`);
    return false;
  }
}

function discoverSkills(skillsDir) {
  const skills = [];
  if (!fs.existsSync(skillsDir)) return skills;
  fs.readdirSync(skillsDir, { withFileTypes: true }).forEach(entry => {
    if (entry.isDirectory()) {
      const skillPath = path.join(skillsDir, entry.name, 'SKILL.md');
      if (fs.existsSync(skillPath)) skills.push({ name: entry.name, path: skillPath });
    }
  });
  return skills;
}

function convertAgents(agentsDir, outputDir) {
  console.log(`\n--- Converting Agents ---`);
  let success = 0, fail = 0;
  if (!fs.existsSync(agentsDir)) return { success, fail };
  
  const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
  files.forEach(file => {
    const baseName = path.basename(file, '.md');
    const outputPath = path.join(outputDir, `${baseName}.json`);
    if (convertFile(path.join(agentsDir, file), outputPath, false)) success++;
    else fail++;
  });
  return { success, fail };
}

function convertSkills(skillsDir, outputDir) {
  console.log(`\n--- Converting Skills ---`);
  let success = 0, fail = 0;
  const skills = discoverSkills(skillsDir);
  skills.forEach(skill => {
    const outputPath = path.join(outputDir, `${skill.name}.json`);
    if (convertFile(skill.path, outputPath, true)) success++;
    else fail++;
  });
  return { success, fail };
}

function main() {
  const args = process.argv.slice(2);
  const type = args.find(a => a.startsWith('--type='))?.split('=')[1] || 'all';
  const outputDir = args.find(a => !a.startsWith('--')) || path.join(__dirname, '.kiro', 'agents');
  
  console.log('Claude Code to Kiro CLI Converter\n==================================\n');
  
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  
  let totalSuccess = 0, totalFail = 0;
  
  if (type === 'agents' || type === 'all') {
    const r = convertAgents(path.join(__dirname, 'agents'), outputDir);
    totalSuccess += r.success; totalFail += r.fail;
  }
  
  if (type === 'skills' || type === 'all') {
    const r = convertSkills(path.join(__dirname, 'skills'), outputDir);
    totalSuccess += r.success; totalFail += r.fail;
  }
  
  console.log(`\n==================================`);
  console.log(`Complete! ✓ ${totalSuccess}, ✗ ${totalFail}`);
  console.log(`Output: ${outputDir}`);
}

if (require.main === module) main();
