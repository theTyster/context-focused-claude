#!/usr/bin/env node

/**
 * Convert Claude Code agents to OpenCode format
 * 
 * Usage:
 *   node convert-agents-to-opencode.js [input-dir] [output-dir]
 * 
 * Defaults:
 *   input-dir: ./agents
 *   output-dir: ~/.config/opencode/agents
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
  'LS': 'bash', // LS commands typically use bash
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
  
  // Add model if specified
  if (metadata.model) {
    const convertedModel = convertModel(metadata.model);
    if (convertedModel) {
      opencodeFrontmatter.model = convertedModel;
    }
  }
  
  // Build YAML frontmatter
  let yaml = '---\n';
  yaml += `description: ${opencodeFrontmatter.description}\n`;
  yaml += `mode: ${opencodeFrontmatter.mode}\n`;
  
  if (opencodeFrontmatter.model) {
    yaml += `model: ${opencodeFrontmatter.model}\n`;
  }
  
  if (opencodeFrontmatter.tools && Object.keys(opencodeFrontmatter.tools).length > 0) {
    yaml += 'tools:\n';
    Object.entries(opencodeFrontmatter.tools).forEach(([tool, enabled]) => {
      yaml += `  ${tool}: ${enabled}\n`;
    });
  }
  
  yaml += '---\n\n';
  
  return yaml + body;
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

function main() {
  const args = process.argv.slice(2);
  const inputDir = args[0] || path.join(__dirname, 'agents');
  const outputDir = args[1] || path.join(os.homedir(), '.config', 'opencode', 'agents');
  
  console.log('Claude Code to OpenCode Agent Converter');
  console.log('========================================\n');
  console.log(`Input directory:  ${inputDir}`);
  console.log(`Output directory: ${outputDir}\n`);
  
  // Check if input directory exists
  if (!fs.existsSync(inputDir)) {
    console.error(`Error: Input directory does not exist: ${inputDir}`);
    process.exit(1);
  }
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    console.log(`Creating output directory: ${outputDir}\n`);
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Find all .md files in input directory
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.md'));
  
  if (files.length === 0) {
    console.log('No .md files found in input directory.');
    process.exit(0);
  }
  
  console.log(`Found ${files.length} agent(s) to convert:\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  files.forEach(file => {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    
    if (convertFile(inputPath, outputPath)) {
      successCount++;
    } else {
      failCount++;
    }
  });
  
  console.log(`\n========================================`);
  console.log(`Conversion complete!`);
  console.log(`  ✓ Successful: ${successCount}`);
  if (failCount > 0) {
    console.log(`  ✗ Failed: ${failCount}`);
  }
  console.log(`\nConverted agents are in: ${outputDir}`);
  console.log(`\nYou can now use these agents in OpenCode by:`);
  console.log(`  1. Running 'opencode' in your project`);
  console.log(`  2. Typing '@' to see available agents`);
  console.log(`  3. Selecting your custom agents\n`);
}

if (require.main === module) {
  main();
}

module.exports = { parseClaudeCodeAgent, convertToOpenCodeFormat, convertTools, convertModel };
