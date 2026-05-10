import type { AgentTemplate } from '@h-orchestra/shared';

const PYTHON_TEMPLATE: AgentTemplate = {
  id: 'python',
  name: 'Python Agent Harness',
  description: 'PydanticAI / LangGraph scaffold with venv, progress ledger, and skill templates.',
  ecosystem: 'python',
  version: '1.0.0',
  source: 'builtin',
  variables: [
    {
      name: 'PROJECT_NAME',
      label: 'Project Name',
      description: 'Name of the project (used in CLAUDE.md and init.sh)',
      type: 'string',
      default: 'my-agent-project',
      required: true,
    },
    {
      name: 'PYTHON_VERSION',
      label: 'Python Version',
      description: 'Python version to use in venv',
      type: 'enum',
      default: '3.12',
      required: true,
      enumValues: ['3.10', '3.11', '3.12', '3.13'],
    },
    {
      name: 'TEST_RUNNER',
      label: 'Test Runner',
      description: 'Test framework to use',
      type: 'enum',
      default: 'pytest',
      required: false,
      enumValues: ['pytest', 'unittest'],
    },
  ],
  files: [
    { templatePath: 'init.sh.tmpl', outputPath: 'init.sh' },
    { templatePath: 'CLAUDE.md.tmpl', outputPath: 'CLAUDE.md' },
    { templatePath: 'claude-progress.txt.tmpl', outputPath: 'claude-progress.txt' },
    { templatePath: 'feature_list.json.tmpl', outputPath: 'feature_list.json' },
    { templatePath: 'SKILL.md.tmpl', outputPath: '.claude/skills/base/SKILL.md' },
  ],
};

const DOTNET_TEMPLATE: AgentTemplate = {
  id: 'dotnet',
  name: '.NET Agent Harness',
  description: 'C# scaffold with MSBuild integration, dotnet test backpressure, and plugin structure.',
  ecosystem: 'dotnet',
  version: '1.0.0',
  source: 'builtin',
  variables: [
    {
      name: 'PROJECT_NAME',
      label: 'Project Name',
      description: 'Name of the .NET project/solution',
      type: 'string',
      default: 'MyAgentProject',
      required: true,
    },
    {
      name: 'DOTNET_VERSION',
      label: '.NET Version',
      description: '.NET SDK version',
      type: 'enum',
      default: '9.0',
      required: true,
      enumValues: ['8.0', '9.0'],
    },
    {
      name: 'TEST_FILTER',
      label: 'Test Filter',
      description: 'dotnet test --filter expression for quick validation',
      type: 'string',
      default: 'Category=Unit',
      required: false,
    },
  ],
  files: [
    { templatePath: 'init.sh.tmpl', outputPath: 'init.sh' },
    { templatePath: 'CLAUDE.md.tmpl', outputPath: 'CLAUDE.md' },
    { templatePath: 'claude-progress.txt.tmpl', outputPath: 'claude-progress.txt' },
    { templatePath: 'feature_list.json.tmpl', outputPath: 'feature_list.json' },
    { templatePath: 'SKILL.md.tmpl', outputPath: '.claude/skills/base/SKILL.md' },
  ],
};

const registry: AgentTemplate[] = [PYTHON_TEMPLATE, DOTNET_TEMPLATE];

export function getTemplateRegistry(): AgentTemplate[] {
  return registry;
}

export function addCustomTemplate(template: AgentTemplate): void {
  registry.push(template);
}
