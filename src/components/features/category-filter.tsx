"use client";

import { FeatureCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: FeatureCategory | "all";
  onCategoryChange: (category: FeatureCategory | "all") => void;
}

const categories: Array<{ value: FeatureCategory | "all"; label: string; color: string }> = [
  { value: "all", label: "すべて", color: "bg-gray-500" },
  { value: "tools", label: "ツール", color: "bg-blue-500" },
  { value: "mcp", label: "MCP", color: "bg-purple-500" },
  { value: "hooks", label: "フック", color: "bg-green-500" },
  { value: "settings", label: "設定", color: "bg-orange-500" },
  { value: "tui", label: "TUI", color: "bg-pink-500" },
  { value: "general", label: "一般", color: "bg-gray-500" },
  { value: "other", label: "その他", color: "bg-gray-400" },
];

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.value}
          variant={selectedCategory === category.value ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.value)}
          className={cn(
            "transition-all duration-150",
            selectedCategory === category.value && category.color,
            selectedCategory !== category.value && "hover:bg-gray-100"
          )}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}
