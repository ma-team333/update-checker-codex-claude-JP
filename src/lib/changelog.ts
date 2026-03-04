import type { ClaudeFeature, FeatureCategory } from '@/types';

export interface ChangelogEntry {
  version: string;
  date?: string;
  features: Array<{
    title: string;
    description: string;
    category: FeatureCategory;
  }>;
}

/**
 * Parse changelog content into structured entries
 * @param content - The raw markdown changelog content
 * @returns Array of parsed changelog entries
 */
export function parseChangelog(content: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  const lines = content.split('\n');

  let currentEntry: ChangelogEntry | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match version header: ## version
    const versionMatch = line.match(/^##\s+([\d.]+)/);
    if (versionMatch) {
      // Save previous entry
      if (currentEntry) {
        entries.push(currentEntry);
      }

      currentEntry = {
        version: versionMatch[1],
        features: [],
      };
      continue;
    }

    if (!currentEntry) {
      continue;
    }

    // Match "Added" features: - Added ...
    const addedMatch = line.match(/^- Added\s+(.+)$/);
    if (addedMatch) {
      const title = addedMatch[1].trim();

      // Collect multi-line description
      let description = '';
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j];
        // Stop at next list item, version header, or empty line followed by another list item
        if (nextLine.match(/^##\s+/) || nextLine.match(/^- (?:Added|Fixed|Improved|Changed|Removed)/)) {
          break;
        }
        if (nextLine.trim()) {
          description += nextLine.trim() + ' ';
        }
        j++;
      }

      currentEntry.features.push({
        title,
        description: description.trim(),
        category: categorizeFeature(title, description),
      });
    }
  }

  // Don't forget the last entry
  if (currentEntry) {
    entries.push(currentEntry);
  }

  return entries;
}

/**
 * Categorize a feature based on title and description
 */
export function categorizeFeature(title: string, description: string): FeatureCategory {
  const text = (title + ' ' + description).toLowerCase();

  // Tool-related features
  if (
    text.includes('tool') ||
    text.includes('read') ||
    text.includes('write') ||
    text.includes('edit') ||
    text.includes('bash') ||
    text.includes('grep') ||
    text.includes('glob')
  ) {
    return 'tools';
  }

  // MCP server features
  if (
    text.includes('mcp') ||
    text.includes('model context protocol') ||
    text.includes('server')
  ) {
    return 'mcp';
  }

  // Hook features
  if (text.includes('hook') || text.includes('pre-commit') || text.includes('middleware')) {
    return 'hooks';
  }

  // Settings/config features
  if (
    text.includes('setting') ||
    text.includes('config') ||
    text.includes('preference') ||
    text.includes('option')
  ) {
    return 'settings';
  }

  // General improvements
  if (
    text.includes('improve') ||
    text.includes('better') ||
    text.includes('enhance') ||
    text.includes('optimize') ||
    text.includes('performance')
  ) {
    return 'general';
  }

  return 'other';
}

/**
 * Convert changelog entries to feature objects
 */
export function changelogToFeatures(
  entries: ChangelogEntry[]
): Omit<ClaudeFeature, 'id' | 'isLearned' | 'createdAt'>[] {
  const features: Omit<ClaudeFeature, 'id' | 'isLearned' | 'createdAt'>[] = [];

  for (const entry of entries) {
    for (const feature of entry.features) {
      features.push({
        name: feature.title,
        version: entry.version,
        description: feature.description || feature.title,
        category: feature.category,
        releaseDate: new Date(),
      });
    }
  }

  return features;
}
