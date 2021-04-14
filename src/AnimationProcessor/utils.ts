import {TAnimationFrame, TLoadedAnimationFrame} from './types';
import {getAbsolutePath, validateImagePath} from '../utils';
import {createCanvas, Image, loadImage} from 'canvas';
import p from 'path';

function validatePositiveInt(value: number, fieldName: string) {
  if (Math.floor(value) !== value || value <= 0) {
    throw new Error(`Field ${fieldName} should be positive int value`);
  }
}

function validateInt(value: number, fieldName: string) {
  if (Math.floor(value) !== value) {
    throw new Error(`Field ${fieldName} should be int value`);
  }
}

/**
 * Checks if frame has valid settings.
 * @param frame
 */
export async function loadFrame(
  frame: TAnimationFrame,
): Promise<TLoadedAnimationFrame> {
  const {path, duration, left = 0, top = 0} = frame;

  // Check if image has correct extension.
  validateImagePath(path, 'input');

  const image = await loadImage(path);
  const {width = image.width, height = image.height} = frame;

  // Check all number fields.
  validatePositiveInt(duration, 'duration');
  validatePositiveInt(height, 'height');
  validatePositiveInt(width, 'width');
  validateInt(left, 'left');
  validateInt(top, 'top');

  return {image, left, top, duration, height, width, path};
}

export function getOffset(
  currentOffset: number,
  frameOffset: number,
): number {
  return Math.max(Math.min(currentOffset, frameOffset), 0);
}

export function calculateOffset(
  canvasSize: number,
  frameSize: number,
  frameOffset: number,
): number {
  return canvasSize - frameSize - frameOffset;
}

export function imageToBase64(image: Image): string {
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image);

  return canvas.toDataURL();
}

function getPixel(
  imageData: ImageData,
  pixel: number
): [number, number, number, number] {
  const from = pixel * 4;
  const hex = imageData.data.slice(from, from + 4);

  return [hex[0], hex[1], hex[2], hex[3]];
}

function assignPixel(
  imageData: ImageData,
  pixel: number,
  hex: [number, number, number, number]
) {
  const from = pixel * 4;

  for (let i = 0; i < 4; i++) {
    imageData.data[from + i] = hex[i];
  }
}

export function getImageDataDiff(
  current: ImageData,
  previous: ImageData
): ImageData {
  const result = new ImageData(current.width, current.height);

  for (let y = 0; y < current.height; y++) {
    for (let x = 0; x < current.width; x++) {
      const pixelNumber = y * current.width + x;
      const prevPixel = getPixel(previous, pixelNumber);
      const currentPixel = getPixel(current, pixelNumber);
      const hasDifference = prevPixel.some((component, idx) => {
        return component !== currentPixel[idx];
      })

      if (hasDifference) {
        assignPixel(result, pixelNumber, currentPixel);
      }
    }
  }

  return result;
}