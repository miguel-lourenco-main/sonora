/** Types used by the utils module */

export interface CurrencyFormatParams {
  /** The ISO currency code (e.g., 'USD', 'EUR') */
  currencyCode: string;
  /** The locale identifier (e.g., 'en-US') */
  locale: string;
  /** The numeric value to format */
  value: string | number;
}

export interface FileExtensionInfo {
  /** File extension without dot */
  extension: string;
  /** MIME type for the file extension */
  mimeType: string;
}

export interface InsertOrUpdateOptions<T> {
  /** React state setter function */
  setter: React.Dispatch<React.SetStateAction<T[]>>;
  /** The item to insert or update */
  newItem: T;
}

export interface DeleteOptions<T> {
  /** React state setter function */
  setter: React.Dispatch<React.SetStateAction<T[]>>;
  /** ID of the item to delete */
  deletedItemId: string;
} 