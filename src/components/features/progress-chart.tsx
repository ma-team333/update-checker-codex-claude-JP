"use client";

import type { ClaudeFeature } from "@/types";

interface ProgressChartProps {
  features: ClaudeFeature[];
}

export function ProgressChart({ features }: ProgressChartProps) {
  const learned = features.filter(f => f.isLearned).length;
  const total = features.length;
  const percentage = total > 0 ? Math.round((learned / total) * 100) : 0;

  return (
    <div className="flex items-center justify-center h-[300px]">
      <div className="text-center">
        <div className="text-6xl font-bold mb-2">{percentage}%</div>
        <p className="text-muted-foreground">
          {learned} of {total} features learned
        </p>
        <div className="mt-4 w-full bg-secondary rounded-full h-4 max-w-md mx-auto">
          <div
            className="bg-primary h-4 rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
