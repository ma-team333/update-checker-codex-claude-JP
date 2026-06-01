"use client";

import { useRouter } from "next/navigation";
import { ClaudeFeature } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, CATEGORY_CONFIG, SOURCE_CONFIG } from "@/lib/utils";

interface FeatureCardProps {
  feature: ClaudeFeature;
  onToggleLearned: (id: string) => void;
}

export function FeatureCard({ feature, onToggleLearned }: FeatureCardProps) {
  const router = useRouter();
  const categoryConfig = CATEGORY_CONFIG[feature.category] || CATEGORY_CONFIG.other;

  const handleClick = () => {
    router.push(`/features/${feature.id}`);
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-150 hover:shadow-md",
        feature.isLearned && "opacity-60"
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={feature.isLearned}
            onCheckedChange={(checked) => {
              if (checked) {
                onToggleLearned(feature.id);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={cn("text-xs text-white", categoryConfig.color)}>
                {categoryConfig.label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                v{feature.version}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {SOURCE_CONFIG[feature.source].icon}
              </span>
            </div>
            <h3 className={cn(
              "font-medium truncate",
              feature.isLearned && "line-through"
            )}>
              {feature.name}
            </h3>
            {feature.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {feature.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
