"use client";

import { useMemo } from "react";
import type { ClaudeFeature } from "@/types";
import { FeatureCard } from "./feature-card";
import { compareVersions, noop } from "@/lib/utils";

interface FeatureCardGridProps {
  features: ClaudeFeature[];
  onToggleLearned?: (id: string) => void;
}

export function FeatureCardGrid({ features, onToggleLearned }: FeatureCardGridProps) {
  // Sort features by version (newest first)
  const sortedFeatures = useMemo(() => {
    return [...features].sort((a, b) => compareVersions(a.version, b.version));
  }, [features]);

  if (sortedFeatures.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No features found. Click refresh to fetch from the changelog.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sortedFeatures.map((feature) => (
        <FeatureCard
          key={feature.id}
          feature={feature}
          onToggleLearned={onToggleLearned ?? noop}
        />
      ))}
    </div>
  );
}
