import {InvalidArgumentError} from 'commander';
import p from 'path';

/**
 * Parses value as positive float number.
 * @param value
 */
export function parsePositiveFloat(value: string): number {
  const parsedValue = parseFloat(value);

  if (isNaN(parsedValue) || parsedValue < 0) {
    throw new InvalidArgumentError('Should be positive float number');
  }
  return parsedValue;
}

/**
 * Parses value as positive whole number.
 * @param value
 */
export function parsePositiveInt(value: string): number {
  const parsedValue = parseInt(value, 10);

  if (isNaN(parsedValue) || parsedValue < 0) {
    throw new InvalidArgumentError('Should be positive whole number');
  }
  return parsedValue;
}

/**
 * Converts path to absolute.
 * @param path
 */
export function toAbsolutePath(path: string): string {
  return p.isAbsolute(path) ? path : p.resolve(process.cwd(), path);
}