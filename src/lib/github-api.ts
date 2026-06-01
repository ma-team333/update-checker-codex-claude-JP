/**
 * Fetches the raw CHANGELOG.md content via our API route (avoids CORS)
 */
export async function fetchChangelog(): Promise<string> {
  try {
    const response = await fetch('/api/changelog');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.content;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Changelog の取得に失敗: ${error.message}`);
    }
    throw new Error('Changelog の取得に失敗: 不明なエラー');
  }
}

/**
 * Fetches Codex CLI releases via our API route
 */
export async function fetchCodexChangelog(): Promise<string> {
  try {
    const response = await fetch('/api/changelog/codex');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.content;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Codex Changelog の取得に失敗: ${error.message}`);
    }
    throw new Error('Codex Changelog の取得に失敗: 不明なエラー');
  }
}
