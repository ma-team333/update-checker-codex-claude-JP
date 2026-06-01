import { create } from 'zustand';
import type { ClaudeFeature, LearningSession, FeatureCategory, FeatureSource } from '@/types';
import {
  getFeatures,
  createFeature as dbCreateFeature,
  updateFeature as dbUpdateFeature,
  getLearningSessions,
  getLearningProgress,
} from './db';
import { fetchChangelog, fetchCodexChangelog } from './github-api';
import { parseChangelog, parseCodexReleases, changelogToFeatures } from './changelog';

interface FeatureStore {
  features: ClaudeFeature[];
  learningSessions: LearningSession[];
  isLoading: boolean;
  lastFetched: Date | null;
  currentSource: FeatureSource;

  loadFeatures: () => Promise<void>;
  refreshFromChangelog: () => Promise<void>;
  markAsLearned: (featureId: string, notes?: string) => Promise<void>;
  unmarkAsLearned: (featureId: string) => Promise<void>;
  setSource: (source: FeatureSource) => void;
  getSourceFeatures: () => ClaudeFeature[];
  loadLearningProgress: () => Promise<void>;
}

export const useFeatureStore = create<FeatureStore>((set, get) => ({
  features: [],
  learningSessions: [],
  isLoading: false,
  lastFetched: null,
  currentSource: 'codex',

  setSource: (source: FeatureSource) => {
    set({ currentSource: source });
  },

  getSourceFeatures: () => {
    const { features, currentSource } = get();
    return features.filter(f => f.source === currentSource);
  },

  loadFeatures: async () => {
    set({ isLoading: true });
    const features = await getFeatures();
    set({ features, isLoading: false });
  },

  refreshFromChangelog: async () => {
    set({ isLoading: true });
    try {
      const { currentSource } = get();

      if (currentSource === 'codex') {
        const content = await fetchCodexChangelog();
        const entries = parseCodexReleases(content);
        const newFeatures = changelogToFeatures(entries, 'codex');

        for (const feature of newFeatures) {
          const exists = get().features.some(
            f => f.name === feature.name && f.version === feature.version && f.source === 'codex'
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
      } else {
        const content = await fetchChangelog();
        const entries = parseChangelog(content);
        const newFeatures = changelogToFeatures(entries, 'claude-code');

        for (const feature of newFeatures) {
          const exists = get().features.some(
            f => f.name === feature.name && f.version === feature.version && f.source === 'claude-code'
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
      }

      await get().loadFeatures();
      set({ lastFetched: new Date() });
    } catch (error) {
      console.error('更新に失敗:', error);
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

  loadLearningProgress: async () => {
    await get().loadFeatures();
  },
}));
