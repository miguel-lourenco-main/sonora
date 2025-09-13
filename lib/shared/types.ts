/**
 * Types for the shared package
 * 
 * Guidelines for defining types here:
 * 1. The type must be shared between multiple packages
 * 2. The type should be used by this package
 * 
 * Note: Due to Turborepo's parallel compilation behavior, types should be defined
 * in packages that are dependencies of their consumers, not the other way around.
 * Packages compile in parallel unless they have explicit dependencies on each other.
 * 
 * If a type doesn't meet these requirements, consider placing it in a more
 * appropriate package.
 */

export type PlainFileObject = {
  /** Name of the file */
  name: string;
  /** MIME type or file extension */
  type: string;
  /** File size in bytes */
  size: number;
  /** Last modified timestamp */
  lastModified: number;
  /** File contents as string, ArrayBuffer, or null if not loaded */
  content: string | ArrayBuffer | null;
}

export type Language = {
  /** Full language name (e.g., "English (United States)") */
  longValue: string;
  /** Language code (e.g., "en") */
  value: string;
  /** Display label for the language */
  label: string;
}

export type LanguageRegion = {
  /** Region/country code in BCP 47 format (e.g., "en-US") */
  code: string;
  /** Region/country name (e.g., "United States") */
  name: string;
}