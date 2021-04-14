import p from 'path';

/**
 * Validates image path;
 * @param path
 * @param type
 */
export function validateImagePath(path: string, type: 'input' | 'output') {
  if (!p.isAbsolute(path)) {
    throw new Error('Path to image should be absolute');
  }
  const {ext} = p.parse(path);
  const extensions = type === 'input'
    ? ['.png', '.jpeg', '.jpg']
    : ['.png', '.jpeg'];

  if (!extensions.includes(ext)) {
    throw new Error(`Unsupported ${type} extension: ${ext}`);
  }
}

export function getAbsolutePath(
  path: string,
  cwd = process.cwd()
): string {
  return p.isAbsolute(path)
    ? path
    : p.resolve(cwd, path);
}