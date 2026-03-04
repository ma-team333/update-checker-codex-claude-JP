"use client";

import { useEffect } from "react";
import { useFeatureStore } from "@/lib/store";
import { FeatureCardGrid } from "@/components/features/feature-card-grid";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function FeaturesPage() {
  const { features, isLoading, loadFeatures, refreshFromChangelog, markAsLearned } = useFeatureStore();

  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);

  const handleRefresh = async () => {
    await refreshFromChangelog();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Features</h1>
          <p className="text-muted-foreground mt-1">
            Explore Claude Code features and track your learning progress
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh from Changelog
        </Button>
      </div>

      <FeatureCardGrid
        features={features}
        onToggleLearned={markAsLearned}
      />
    </div>
  );
}
