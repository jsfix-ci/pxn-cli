import p from 'path';

/**
 * Checks if paths have correct extensions.
 * @param inputPath
 * @param outputPath
 */
export function validatePaths(inputPath: string, outputPath: string) {
  const {ext: inputExt} = p.parse(inputPath);
  const {ext: outputExt} = p.parse(outputPath);

  if (!['.png', '.jpeg', '.jpg'].includes(inputExt)) {
    throw new Error('Unsupported input extension: ' + inputExt);
  }
  if (!['.png', '.jpeg'].includes(outputExt)) {
    throw new Error('Unsupported output extension: ' + outputExt);
  }
}