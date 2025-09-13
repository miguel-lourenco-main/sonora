import i18next, { type InitOptions, i18n } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

// Avoid throwing/suspending loops by initializing once per settings
let initializedKey: string | null = null;

/**
 * Initialize the i18n instance on the client.
 * @param settings - the i18n settings
 * @param resolver - a function that resolves the i18n resources
 */
export async function initializeI18nClient(
  settings: InitOptions,
  resolver: (lang: string, namespace: string) => Promise<object>,
): Promise<i18n> {
  const loadedLanguages: string[] = [];
  const loadedNamespaces: string[] = [];

  await i18next
    .use(
      resourcesToBackend(async (language, namespace, callback) => {
        const data = await resolver(language, namespace);

        if (!loadedLanguages.includes(language)) {
          loadedLanguages.push(language);
        }

        if (!loadedNamespaces.includes(namespace)) {
          loadedNamespaces.push(namespace);
        }

        return callback(null, data);
      }),
    )
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      ...settings,
      detection: {
        order: ['htmlTag', 'cookie', 'navigator'],
        caches: ['cookie'],
        lookupCookie: 'lang',
      },
      interpolation: {
        escapeValue: false,
      },
    })
    .catch((err) => {
      console.error('Error initializing i18n client', err);
    });

  // Do not throw; return the instance even if nothing loaded yet to avoid Suspense loops

  return i18next;
}


