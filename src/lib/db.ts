import Dexie, { type EntityTable } from 'dexie';
import type { ClaudeFeature, LearningSession, LearningProgress, FeatureCategory, FeatureSource } from '@/types';

const db = new Dexie('FeatureLearnerDB') as Dexie & {
  features: EntityTable<ClaudeFeature, 'id'>;
  learningSessions: EntityTable<LearningSession, 'id'>;
};

db.version(2).stores({
  features: 'id, name, category, version, releaseDate, isLearned, createdAt, source',
  learningSessions: 'id, featureId, startedAt, completedAt',
});

export { db };

// Feature operations
export async function createFeature(feature: ClaudeFeature): Promise<string> {
  return await db.features.add(feature);
}

export async function getFeatures(source?: FeatureSource): Promise<ClaudeFeature[]> {
  if (source) {
    return await db.features.where('source').equals(source).reverse().sortBy('createdAt');
  }
  return await db.features.orderBy('createdAt').reverse().toArray();
}

export async function getFeature(id: string): Promise<ClaudeFeature | undefined> {
  return await db.features.get(id);
}

export async function updateFeature(id: string, changes: Partial<ClaudeFeature>): Promise<number> {
  return await db.features.update(id, changes);
}

export async function deleteFeature(id: string): Promise<void> {
  await db.features.delete(id);
  await db.learningSessions.where('featureId').equals(id).delete();
}

export async function getUnlearnedFeatures(source?: FeatureSource): Promise<ClaudeFeature[]> {
  const all = await getFeatures(source);
  return all.filter(feature => !feature.isLearned);
}

export async function getFeaturesByCategory(category: FeatureCategory, source?: FeatureSource): Promise<ClaudeFeature[]> {
  const all = await getFeatures(source);
  return all.filter(f => f.category === category);
}

// LearningSession operations
export async function createLearningSession(session: LearningSession): Promise<string> {
  return await db.learningSessions.add(session);
}

export async function getLearningSessions(): Promise<LearningSession[]> {
  return await db.learningSessions.orderBy('startedAt').reverse().toArray();
}

export async function getLearningSessionsByFeature(featureId: string): Promise<LearningSession[]> {
  return await db.learningSessions.where('featureId').equals(featureId).reverse().sortBy('startedAt');
}

export async function updateLearningSession(id: string, changes: Partial<LearningSession>): Promise<number> {
  return await db.learningSessions.update(id, changes);
}

export async function deleteLearningSession(id: string): Promise<void> {
  await db.learningSessions.delete(id);
}

export async function getActiveLearningSession(): Promise<LearningSession | undefined> {
  return await db.learningSessions.where('completedAt').equals(null as unknown as Date).first();
}

// Statistics
export async function getLearningProgress(source?: FeatureSource): Promise<LearningProgress> {
  const features = await getFeatures(source);
  const byCategory: Record<FeatureCategory, { total: number; learned: number }> = {
    general: { total: 0, learned: 0 },
    tools: { total: 0, learned: 0 },
    mcp: { total: 0, learned: 0 },
    hooks: { total: 0, learned: 0 },
    settings: { total: 0, learned: 0 },
    tui: { total: 0, learned: 0 },
    other: { total: 0, learned: 0 },
  };

  let learned = 0;

  features.forEach(feature => {
    byCategory[feature.category].total++;
    if (feature.isLearned) {
      byCategory[feature.category].learned++;
      learned++;
    }
  });

  return {
    total: features.length,
    learned,
    byCategory,
  };
}
