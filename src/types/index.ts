export type FeatureCategory = 'general' | 'tools' | 'mcp' | 'hooks' | 'settings' | 'tui' | 'other';

export type FeatureSource = 'claude-code' | 'codex';

export interface ClaudeFeature {
  id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  version: string;
  releaseDate: Date;
  changelogUrl?: string;
  isLearned: boolean;
  learnedAt?: Date;
  createdAt: Date;
  source: FeatureSource;
}

export interface LearningSession {
  id: string;
  featureId: string;
  startedAt: Date;
  completedAt?: Date;
  notes?: string;
}

export interface LearningProgress {
  total: number;
  learned: number;
  byCategory: Record<FeatureCategory, { total: number; learned: number }>;
}
