import type { ClaudeFeature, FeatureCategory, FeatureSource } from '@/types';

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
 * Parse Claude Code changelog content into structured entries
 */
export function parseChangelog(content: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  const lines = content.split('\n');

  let currentEntry: ChangelogEntry | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const versionMatch = line.match(/^##\s+([\d.]+)/);
    if (versionMatch) {
      if (currentEntry) {
        entries.push(currentEntry);
      }
      currentEntry = {
        version: versionMatch[1],
        features: [],
      };
      continue;
    }

    if (!currentEntry) continue;

    const addedMatch = line.match(/^- Added\s+(.+)$/);
    if (addedMatch) {
      const title = addedMatch[1].trim();

      let description = '';
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j];
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
        category: categorizeClaudeFeature(title, description),
      });
    }
  }

  if (currentEntry) {
    entries.push(currentEntry);
  }

  return entries;
}

/**
 * Parse Codex CLI GitHub releases JSON into structured entries
 */
export function parseCodexReleases(releasesJson: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];

  try {
    const releases = JSON.parse(releasesJson);

    for (const release of releases) {
      if (!release.tag_name) continue;

      const version = release.tag_name.replace(/^v/, '');
      const body: string = release.body || '';
      const date: string = release.published_at || '';

      const features: ChangelogEntry['features'] = [];

      // Parse the body text to extract features
      const bodyLines = body.split('\n');
      let currentSection = '';

      for (const line of bodyLines) {
        const trimmed = line.trim();

        // Detect section headers
        if (trimmed.match(/^#{1,4}\s+/)) {
          const sectionText = trimmed.replace(/^#{1,4}\s+/, '').toLowerCase();
          if (sectionText.includes('new') || sectionText.includes('feature') || sectionText.includes('✨') || sectionText.includes('追加')) {
            currentSection = 'new';
          } else if (sectionText.includes('fix') || sectionText.includes('bug') || sectionText.includes('🛠') || sectionText.includes('修正')) {
            currentSection = 'fix';
          } else {
            currentSection = '';
          }
          continue;
        }

        // Parse list items
        const listMatch = trimmed.match(/^[-*]\s+(.+)$/);
        if (listMatch) {
          const title = listMatch[1].trim();
          if (title.length > 3) {
            features.push({
              title,
              description: title,
              category: categorizeCodexFeature(title),
            });
          }
        }
      }

      // If no features were parsed from structured content, create a summary entry
      if (features.length === 0 && body.length > 10) {
        const summaryLines = body.split('\n').filter(l => l.trim().length > 0).slice(0, 5);
        for (const sl of summaryLines) {
          const cleaned = sl.replace(/^[-*#]+\s*/, '').trim();
          if (cleaned.length > 5) {
            features.push({
              title: cleaned.slice(0, 120),
              description: cleaned,
              category: categorizeCodexFeature(cleaned),
            });
          }
        }
      }

      if (features.length > 0) {
        entries.push({ version, date, features });
      }
    }
  } catch (e) {
    console.error('Codex releases parse error:', e);
  }

  return entries;
}

/**
 * Categorize a Claude Code feature based on title and description
 */
function categorizeClaudeFeature(title: string, description: string): FeatureCategory {
  const text = (title + ' ' + description).toLowerCase();

  if (
    text.includes('tool') || text.includes('read') || text.includes('write') ||
    text.includes('edit') || text.includes('bash') || text.includes('grep') || text.includes('glob')
  ) return 'tools';

  if (text.includes('mcp') || text.includes('model context protocol') || text.includes('server')) return 'mcp';

  if (text.includes('hook') || text.includes('pre-commit') || text.includes('middleware')) return 'hooks';

  if (text.includes('setting') || text.includes('config') || text.includes('preference') || text.includes('option')) return 'settings';

  if (text.includes('improve') || text.includes('better') || text.includes('enhance') || text.includes('optimize') || text.includes('performance')) return 'general';

  return 'other';
}

/**
 * Categorize a Codex CLI feature based on title and description
 */
function categorizeCodexFeature(title: string): FeatureCategory {
  const text = title.toLowerCase();

  if (
    text.includes('tool') || text.includes('exec') || text.includes('sandbox') ||
    text.includes('patch') || text.includes('command') || text.includes('shell') ||
    text.includes('js_repl') || text.includes('apply')
  ) return 'tools';

  if (text.includes('mcp') || text.includes('connector')) return 'mcp';

  if (text.includes('hook') || text.includes('extension')) return 'hooks';

  if (
    text.includes('config') || text.includes('setting') || text.includes('profile') ||
    text.includes('permission') || text.includes('auth') || text.includes('keymap') ||
    text.includes('theme') || text.includes('install')
  ) return 'settings';

  if (
    text.includes('tui') || text.includes('vim') || text.includes('ui') ||
    text.includes('render') || text.includes('display') || text.includes('markdown') ||
    text.includes('scroll') || text.includes('input') || text.includes('picker') ||
    text.includes('modal') || text.includes('status')
  ) return 'tui';

  if (
    text.includes('plugin') || text.includes('skill') || text.includes('marketplace') ||
    text.includes('goal') || text.includes('plan') || text.includes('mode') ||
    text.includes('agent') || text.includes('remote') || text.includes('app-server') ||
    text.includes('sdk') || text.includes('python') || text.includes('model') ||
    text.includes('gpt') || text.includes('fast') || text.includes('provider')
  ) return 'general';

  return 'other';
}

/**
 * Convert changelog entries to feature objects
 */
export function changelogToFeatures(
  entries: ChangelogEntry[],
  source: FeatureSource
): Omit<ClaudeFeature, 'id' | 'isLearned' | 'createdAt'>[] {
  const features: Omit<ClaudeFeature, 'id' | 'isLearned' | 'createdAt'>[] = [];

  for (const entry of entries) {
    for (const feature of entry.features) {
      features.push({
        name: feature.title,
        version: entry.version,
        description: feature.description || feature.title,
        category: feature.category,
        releaseDate: entry.date ? new Date(entry.date) : new Date(),
        source,
      });
    }
  }

  return features;
}
