export type TemplateEcosystem = 'python' | 'dotnet' | 'custom';
export type TemplateSource = 'builtin' | 'zip' | 'git';

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  ecosystem: TemplateEcosystem;
  version: string;
  source: TemplateSource;
  variables: TemplateVariable[];
  files: TemplateFile[];
  gitUri?: string;
}

export interface TemplateVariable {
  name: string;
  label: string;
  description: string;
  type: 'string' | 'boolean' | 'enum';
  default: string | boolean;
  required: boolean;
  enumValues?: string[];
}

export interface TemplateFile {
  templatePath: string;
  outputPath: string;
}

export interface ScaffoldRequest {
  templateId: string;
  targetPath: string;
  variables: Record<string, string | boolean>;
}

export interface ScaffoldResult {
  success: boolean;
  createdFiles: string[];
  errors: string[];
}
