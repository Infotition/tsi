/**
 * Extracts the filename of a relative or absolute path.
 *
 * @param path  The path to extract the filename.
 * @returns     The extracted file name.
 */
export const extractFilename = (path: string) => {
  return path.split('\\').pop() || path;
};
