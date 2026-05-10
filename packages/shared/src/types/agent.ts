export type AgentDefinition = {
  id: string;
  name: string;
  description: string;
  tools: string[];
  body: string;
  sourcePath: string;
};
