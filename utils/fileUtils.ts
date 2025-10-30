
import type { FileData } from '../types';

/**
 * Converts a File object to a base64 string and a preview URL.
 * @param file The file to convert.
 * @returns A promise that resolves to an object containing the base64 data, mime type, and preview URL.
 */
export const fileToGenerativePart = (file: File): Promise<FileData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const previewUrl = result;
      // The result includes the data URL prefix (e.g., "data:image/jpeg;base64,"),
      // so we need to split it off to get just the base64 part.
      const base64 = result.split(',')[1];
      if (!base64) {
        reject(new Error("Failed to extract base64 data from file."));
        return;
      }
      resolve({
        base64,
        mimeType: file.type,
        previewUrl,
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
