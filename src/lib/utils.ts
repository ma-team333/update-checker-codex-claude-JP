import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { FeatureCategory, FeatureSource } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Compare semantic versions (e.g., "2.1.63" vs "2.1.5")
 * @returns negative if a < b, positive if a > b, 0 if equal
 */
export function compareVersions(a: string, b: string): number {
  const versionA = a.split('.').map(Number)
  const versionB = b.split('.').map(Number)

  for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
    const numA = versionA[i] || 0
    const numB = versionB[i] || 0
    if (numA !== numB) return numB - numA // Descending order (newest first)
  }
  return 0
}

/**
 * Category configuration with Japanese labels and colors
 */
export const CATEGORY_CONFIG: Record<FeatureCategory, { label: string; color: string }> = {
  tools: { label: "ツール", color: "bg-blue-500" },
  mcp: { label: "MCP", color: "bg-purple-500" },
  hooks: { label: "フック", color: "bg-green-500" },
  settings: { label: "設定", color: "bg-orange-500" },
  tui: { label: "TUI", color: "bg-pink-500" },
  general: { label: "一般", color: "bg-gray-500" },
  other: { label: "その他", color: "bg-gray-400" },
}

/**
 * Source configuration
 */
export const SOURCE_CONFIG: Record<FeatureSource, {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  changelogLabel: string;
}> = {
  codex: {
    label: "Codex CLI",
    icon: "🟢",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500",
    changelogLabel: "Changelog を取得",
  },
  "claude-code": {
    label: "Claude Code",
    icon: "🟣",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500",
    changelogLabel: "Changelog を取得",
  },
}

/**
 * Noop function for default handlers
 */
export const noop = () => {}
