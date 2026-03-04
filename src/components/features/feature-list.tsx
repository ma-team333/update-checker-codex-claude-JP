"use client";

import { useMemo, useState } from "react";
import { ClaudeFeature, FeatureCategory } from "@/types";
import { FeatureCard } from "./feature-card";
import { Input } from "@/components/ui/input";
import { CategoryFilter } from "./category-filter";

interface FeatureListProps {
  features: ClaudeFeature[];
  onToggleLearned: (id: string) => void;
}

export function FeatureList({ features, onToggleLearned }: FeatureListProps) {
  // Filter and search state (internal component state for simplicity)
  // For larger apps, this would be lifted to the store
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FeatureCategory | "all">("all");
  const [showUnlearnedOnly, setShowUnlearnedOnly] = useState(false);

  const filteredFeatures = useMemo(() => {
    return features.filter((feature) => {
      // Category filter
      if (selectedCategory !== "all" && feature.category !== selectedCategory) {
        return false;
      }

      // Unlearned filter
      if (showUnlearnedOnly && feature.isLearned) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          feature.name.toLowerCase().includes(query) ||
          feature.description.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [features, selectedCategory, showUnlearnedOnly, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <div className="space-y-3">
        <Input
          placeholder="Search features..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex flex-wrap items-center gap-3">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showUnlearnedOnly}
              onChange={(e) => setShowUnlearnedOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span>Unlearned only</span>
          </label>
        </div>
      </div>

      {/* Feature count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredFeatures.length} of {features.length} features
      </p>

      {/* Feature cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeatures.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            onToggleLearned={onToggleLearned}
          />
        ))}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No features found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
