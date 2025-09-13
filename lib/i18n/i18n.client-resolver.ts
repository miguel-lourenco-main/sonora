/**
 * Client-side resolver that fetches translation JSON from public locales.
 */
export async function i18nClientResolver(
  language: string,
  namespace: string,
): Promise<Record<string, string>> {
  try {
    const res = await fetch(`/locales/${language}/${namespace}.json`, {
      cache: 'force-cache',
    });

    if (!res.ok) {
      return {} as Record<string, string>;
    }

    return (await res.json()) as Record<string, string>;
  } catch {
    return {} as Record<string, string>;
  }
}


