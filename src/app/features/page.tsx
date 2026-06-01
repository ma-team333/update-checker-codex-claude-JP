"use client";

import { useEffect, useMemo } from "react";
import { useFeatureStore } from "@/lib/store";
import { FeatureCardGrid } from "@/components/features/feature-card-grid";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { SOURCE_CONFIG } from "@/lib/utils";

export default function FeaturesPage() {
  const { features, isLoading, loadFeatures, refreshFromChangelog, markAsLearned, currentSource } = useFeatureStore();
  const sourceConfig = SOURCE_CONFIG[currentSource];

  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);

  const sourceFeatures = useMemo(
    () => features.filter(f => f.source === currentSource),
    [features, currentSource]
  );

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {sourceConfig.icon} 機能一覧
          </h1>
          <p className="text-muted-foreground mt-1">
            {sourceConfig.label} の機能を探索して学習進捗を管理
          </p>
        </div>
        <Button onClick={refreshFromChangelog} disabled={isLoading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "読み込み中..." : sourceConfig.changelogLabel}
        </Button>
      </div>

      <FeatureCardGrid
        features={sourceFeatures}
        onToggleLearned={markAsLearned}
      />
    </div>
  );
}
