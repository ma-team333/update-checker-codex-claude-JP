import { create } from 'zustand';
import type { ClaudeFeature, LearningSession, FeatureCategory } from '@/types';
import {
  getFeatures,
  createFeature as dbCreateFeature,
  updateFeature as dbUpdateFeature,
  deleteFeature as dbDeleteFeature,
  getUnlearnedFeatures,
  getFeaturesByCategory,
  getLearningSessions,
  createLearningSession,
  updateLearningSession,
  deleteLearningSession,
  getLearningProgress,
} from './db';
import { fetchChangelog } from './github-api';
import { parseChangelog, changelogToFeatures } from './changelog';

interface FeatureStore {
  // State
  features: ClaudeFeature[];
  learningSessions: LearningSession[];
  isLoading: boolean;
  lastFetched: Date | null;

  // Actions
  loadFeatures: () => Promise<void>;
  refreshFromChangelog: () => Promise<void>;
  markAsLearned: (featureId: string, notes?: string) => Promise<void>;
  unmarkAsLearned: (featureId: string) => Promise<void>;
  getUnlearnedFeatures: () => ClaudeFeature[];
  getFeaturesByCategory: (category: FeatureCategory) => ClaudeFeature[];
  loadLearningProgress: () => Promise<void>;
}

export const useFeatureStore = create<FeatureStore>((set, get) => ({
  features: [],
  learningSessions: [],
  isLoading: false,
  lastFetched: null,

  loadFeatures: async () => {
    set({ isLoading: true });
    const features = await getFeatures();
    set({ features, isLoading: false });
  },

  refreshFromChangelog: async () => {
    set({ isLoading: true });
    try {
      const content = await fetchChangelog();
      const entries = parseChangelog(content);
      const newFeatures = changelogToFeatures(entries);

      // Add features that don't exist yet
      for (const feature of newFeatures) {
        const exists = get().features.some(
          f => f.name === feature.name && f.version === feature.version
        );
        if (!exists) {
          await dbCreateFeature({
            ...feature,
            id: crypto.randomUUID(),
            isLearned: false,
            createdAt: new Date(),
          });
        }
      }

      await get().loadFeatures();
      set({ lastFetched: new Date() });
    } catch (error) {
      console.error('Failed to refresh:', error);
    }
    set({ isLoading: false });
  },

  markAsLearned: async (featureId: string, notes?: string) => {
    await dbUpdateFeature(featureId, {
      isLearned: true,
      learnedAt: new Date(),
    });
    await get().loadFeatures();
  },

  unmarkAsLearned: async (featureId: string) => {
    await dbUpdateFeature(featureId, {
      isLearned: false,
      learnedAt: undefined,
    });
    await get().loadFeatures();
  },

  getUnlearnedFeatures: () => {
    return get().features.filter(f => !f.isLearned);
  },

  getFeaturesByCategory: (category: FeatureCategory) => {
    return get().features.filter(f => f.category === category);
  },

  loadLearningProgress: async () => {
    // Progress is calculated on demand
    await get().loadFeatures();
  },
}));
