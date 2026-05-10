import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import AdmZip from 'adm-zip';
import { simpleGit } from 'simple-git';
import type { AgentTemplate } from '@h-orchestra/shared';
import { addCustomTemplate } from './registry.js';

export async function loadTemplateFromZip(zipPath: string): Promise<AgentTemplate> {
  const zip = new AdmZip(zipPath);
  const templateJsonEntry = zip.getEntry('template.json');
  if (!templateJsonEntry) throw new Error('ZIP must contain a template.json at root level');

  const template = JSON.parse(templateJsonEntry.getData().toString('utf-8')) as AgentTemplate;
  addCustomTemplate(template);
  return template;
}

export async function loadTemplateFromGit(
  gitUri: string,
  tmpDir: string
): Promise<AgentTemplate> {
  const cloneDir = join(tmpDir, `template-${Date.now()}`);
  const git = simpleGit();
  await git.clone(gitUri, cloneDir, ['--depth', '1']);

  const templateJson = await readFile(join(cloneDir, 'template.json'), 'utf-8');
  const template = JSON.parse(templateJson) as AgentTemplate;
  template.source = 'git';
  template.gitUri = gitUri;
  addCustomTemplate(template);
  return template;
}
