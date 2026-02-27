#!/usr/bin/env node

/**
 * Convert Claude Code agents and skills to Gemini CLI format
 *
 * Usage:
 *   node convert-to-gemini.js [--type=agents|skills|all] [input-dir] [output-dir]
 *
 * Options:
 *   --type=agents   Convert agents only (default)
 *   --type=skills   Convert skills only
 *   --type=all      Convert both agents and skills
 *
 * Defaults:
 *   input-dir: ./agents (for agents) or ./skills (for skills)
 *   output-dir: ./.gemini
 *
 * Key Differences from OpenCode:
 *   - Tools are arrays, not boolean objects: tools: [read_file, grep, glob]
 *   - Skills have NO tools/model/mode fields (full access by default)
 *   - Output structure preserves skill directory layout
 */

const fs = require('fs');
const path = require('path');

// Tool name mappings (Claude -> Gemini)
const TOOL_MAPPING = {
  'Read': 'read_file',
  'Write': 'write_file',
  'Edit': 'replace',
  'Bash': 'run_shell_command',
  'Grep': 'search_file_content',
  'Glob': 'glob',
  'LS': 'list_directory',
  'WebSearch': 'google_web_search',
  'WebFetch': 'web_fetch',
  'Task': 'activate_skill',
};

// Model mappings (Claude -> Gemini)
const MODEL_MAPPING = {
  'sonnet': 'gemini-2.5-pro',
  'claude-sonnet': 'gemini-2.5-pro',
  'haiku': 'gemini-2.0-flash',
  'claude-haiku': 'gemini-2.0-flash',
  'opus': 'gemini-1.5-pro',
  'claude-opus': 'gemini-3-pro'
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

function convertToolsForGemini(toolsString) {
  // Input: "Read, Grep, Glob, LS"
  // Output: ['read_file', 'search_file_content', 'glob', 'list_directory']
  if (!toolsString) return undefined;

  const toolList = toolsString.split(',').map(t => t.trim());
  const geminiTools = [];

  toolList.forEach(tool => {
    const geminiTool = TOOL_MAPPING[tool];
    if (geminiTool) {
      geminiTools.push(geminiTool);
    } else {
      console.warn(`  ⚠ Unknown tool: ${tool}`);
    }
  });

  return geminiTools.length > 0 ? geminiTools : undefined;
}

function convertModel(modelString) {
  if (!modelString) return undefined;

  const normalized = modelString.toLowerCase().trim();
  return MODEL_MAPPING[normalized] || modelString;
}

function transformBodyForGemini(body) {
  let result = body;

  // Replace backtick-wrapped tool names
  for (const [claudeName, geminiName] of Object.entries(TOOL_MAPPING)) {
    const pattern = new RegExp('`' + claudeName + '`', 'g');
    result = result.replace(pattern, '`' + geminiName + '`');
  }

  return result;
}

function convertAgentToGeminiFormat(claudeAgent) {
  const { metadata, body } = claudeAgent;

  // Build YAML frontmatter
  let yaml = '---\n';
  yaml += `name: ${metadata.name || 'unnamed_agent'}\n`;
  yaml += `description: ${metadata.description}\n`;

  // Convert tools to array format
  if (metadata.tools) {
    const geminiTools = convertToolsForGemini(metadata.tools);
    if (geminiTools && geminiTools.length > 0) {
      yaml += 'tools:\n';
      geminiTools.forEach(tool => {
        yaml += `  - ${tool}\n`;
      });
    }
  }

  // Convert model
  if (metadata.model) {
    const geminiModel = convertModel(metadata.model);
    if (geminiModel) {
      yaml += `model: ${geminiModel}\n`;
    }
  }

  yaml += '---\n\n';

  return yaml + transformBodyForGemini(body);
}

function convertSkillToGeminiFormat(skill) {
  const { metadata, body } = skill;

  // Skills have minimal frontmatter - only name and description
  let yaml = '---\n';
  yaml += `name: ${metadata.name}\n`;
  yaml += `description: ${metadata.description}\n`;
  yaml += '---\n\n';

  return yaml + transformBodyForGemini(body);
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

function convertAgentFile(inputPath, outputPath) {
  console.log(`Converting: ${path.basename(inputPath)}`);

  try {
    const content = fs.readFileSync(inputPath, 'utf8');
    const claudeAgent = parseClaudeCodeAgent(content);

    // Extract name from filename if not in metadata
    if (!claudeAgent.metadata.name) {
      claudeAgent.metadata.name = path.basename(inputPath, '.md');
    }

    const geminiContent = convertAgentToGeminiFormat(claudeAgent);

    fs.writeFileSync(outputPath, geminiContent, 'utf8');
    console.log(`  ✓ Saved to: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Error: ${error.message}`);
    return false;
  }
}

function convertSkillFile(skill, outputDir) {
  console.log(`Converting skill: ${skill.name}`);
  try {
    const content = fs.readFileSync(skill.path, 'utf8');
    const parsedSkill = parseClaudeCodeSkill(content, skill.name);
    const geminiContent = convertSkillToGeminiFormat(parsedSkill);

    // Maintain directory structure for skills
    const skillOutputDir = path.join(outputDir, skill.name);
    if (!fs.existsSync(skillOutputDir)) {
      fs.mkdirSync(skillOutputDir, { recursive: true });
    }

    const outputPath = path.join(skillOutputDir, 'SKILL.md');
    fs.writeFileSync(outputPath, geminiContent, 'utf8');
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
    if (convertAgentFile(path.join(agentsDir, file), path.join(outputDir, file))) {
      success++;
    } else {
      fail++;
    }
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
    if (convertSkillFile(skill, outputDir)) {
      success++;
    } else {
      fail++;
    }
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

  console.log('Claude Code to Gemini CLI Converter');
  console.log('====================================\n');
  console.log(`Conversion type: ${options.type}\n`);

  let totalSuccess = 0, totalFail = 0;

  if (options.type === 'agents' || options.type === 'all') {
    const agentsDir = options.inputDir || path.join(__dirname, 'agents');
    const outputDir = path.join(__dirname, '.gemini', 'agents');

    console.log(`Output directory: ${outputDir}`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const r = convertAgents(agentsDir, outputDir);
    totalSuccess += r.success;
    totalFail += r.fail;
  }

  if (options.type === 'skills' || options.type === 'all') {
    const skillsDir = options.inputDir || path.join(__dirname, 'skills');
    const outputDir = path.join(__dirname, '.gemini', 'skills');

    console.log(`Output directory: ${outputDir}`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const r = convertSkills(skillsDir, outputDir);
    totalSuccess += r.success;
    totalFail += r.fail;
  }

  console.log(`\n====================================`);
  console.log(`Conversion complete! ✓ ${totalSuccess}, ✗ ${totalFail}`);

  if (options.type === 'agents' || options.type === 'all') {
    console.log(`\nAgents are in: ${path.join(__dirname, '.gemini', 'agents')}`);
  }
  if (options.type === 'skills' || options.type === 'all') {
    console.log(`Skills are in: ${path.join(__dirname, '.gemini', 'skills')}`);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseClaudeCodeAgent,
  parseClaudeCodeSkill,
  convertAgentToGeminiFormat,
  convertSkillToGeminiFormat,
  convertToolsForGemini,
  convertModel,
  discoverSkills,
  transformBodyForGemini
};
