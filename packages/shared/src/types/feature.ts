export type FeatureStatus = 'pending' | 'in_progress' | 'done' | 'blocked';

export type Feature = {
  id: string;
  name: string;
  title: string;
  description: string;
  acceptance: string[];
  status: FeatureStatus;
};

export type FeatureList = {
  project: string;
  description: string;
  rules: string[];
  features: Feature[];
};
