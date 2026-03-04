/**
 * Fetches the raw CHANGELOG.md content via our API route (avoids CORS)
 * @returns The changelog content as a string
 * @throws Error if fetch fails
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
      throw new Error(`Failed to fetch changelog: ${error.message}`);
    }
    throw new Error('Failed to fetch changelog: Unknown error');
  }
}
