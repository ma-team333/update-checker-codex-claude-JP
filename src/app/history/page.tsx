"use client";

import { useEffect } from "react";
import { useFeatureStore } from "@/lib/store";
import { LearningHistory } from "@/components/features/learning-history";

export default function HistoryPage() {
  const { learningSessions, loadLearningProgress } = useFeatureStore();

  useEffect(() => {
    loadLearningProgress();
  }, [loadLearningProgress]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">History</h1>
          <p className="text-muted-foreground">
            View your learning history and tracked activities
          </p>
        </div>

        <LearningHistory sessions={learningSessions} />
      </div>
    </div>
  );
}
