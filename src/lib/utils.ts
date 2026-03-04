import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { FeatureCategory } from "@/types"

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
 * Category configuration with labels and colors
 */
export const CATEGORY_CONFIG: Record<FeatureCategory, { label: string; color: string }> = {
  tools: { label: "Tools", color: "bg-blue-500" },
  mcp: { label: "MCP", color: "bg-purple-500" },
  hooks: { label: "Hooks", color: "bg-green-500" },
  settings: { label: "Settings", color: "bg-orange-500" },
  general: { label: "General", color: "bg-gray-500" },
  other: { label: "Other", color: "bg-gray-400" },
}

/**
 * Noop function for default handlers
 */
export const noop = () => {}
