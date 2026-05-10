import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import type { ScaffoldRequest, ScaffoldResult } from '@h-orchestra/shared';
import { getTemplateRegistry } from './registry.js';

export function renderTemplate(
  templateContent: string,
  variables: Record<string, string | boolean>
): string {
  return templateContent.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, name: string) => {
    if (!(name in variables)) {
      throw new Error(`Unresolved template variable: ${name}`);
    }
    return String(variables[name]);
  });
}

export async function scaffoldTemplate(req: ScaffoldRequest): Promise<ScaffoldResult> {
  const templates = getTemplateRegistry();
  const template = templates.find((t) => t.id === req.templateId);
  if (!template) {
    return { success: false, createdFiles: [], errors: [`Template not found: ${req.templateId}`] };
  }

  const createdFiles: string[] = [];
  const errors: string[] = [];

  for (const file of template.files) {
    try {
      const templateDir = new URL(`./built-in/${template.ecosystem}/`, import.meta.url).pathname;
      const templateContent = await readFile(join(templateDir, file.templatePath), 'utf-8');
      const rendered = renderTemplate(templateContent, req.variables);
      const outputPath = join(req.targetPath, file.outputPath);

      await mkdir(dirname(outputPath), { recursive: true });
      const tmp = outputPath + '.tmp';
      await writeFile(tmp, rendered, 'utf-8');
      await rename(tmp, outputPath);
      createdFiles.push(outputPath);
    } catch (err) {
      errors.push(`${file.outputPath}: ${String(err)}`);
    }
  }

  return { success: errors.length === 0, createdFiles, errors };
}
