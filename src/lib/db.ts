import Dexie, { type EntityTable } from 'dexie';
import type { ClaudeFeature, LearningSession, LearningProgress, FeatureCategory } from '@/types';

const db = new Dexie('FeatureLearnerDB') as Dexie & {
  features: EntityTable<ClaudeFeature, 'id'>;
  learningSessions: EntityTable<LearningSession, 'id'>;
};

db.version(1).stores({
  features: 'id, name, category, version, releaseDate, isLearned, createdAt',
  learningSessions: 'id, featureId, startedAt, completedAt',
});

export { db };

// Feature operations
export async function createFeature(feature: ClaudeFeature): Promise<string> {
  return await db.features.add(feature);
}

export async function getFeatures(): Promise<ClaudeFeature[]> {
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
  // Also delete related learning sessions
  await db.learningSessions.where('featureId').equals(id).delete();
}

export async function getUnlearnedFeatures(): Promise<ClaudeFeature[]> {
  return await db.features.filter(feature => !feature.isLearned).toArray();
}

export async function getFeaturesByCategory(category: FeatureCategory): Promise<ClaudeFeature[]> {
  return await db.features.where('category').equals(category).toArray();
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
export async function getLearningProgress(): Promise<LearningProgress> {
  const features = await getFeatures();
  const byCategory: Record<FeatureCategory, { total: number; learned: number }> = {
    general: { total: 0, learned: 0 },
    tools: { total: 0, learned: 0 },
    mcp: { total: 0, learned: 0 },
    hooks: { total: 0, learned: 0 },
    settings: { total: 0, learned: 0 },
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
