import {loadImage, createCanvas, Canvas} from 'canvas';
import fs from 'fs';
import p from 'path';
import {IPixelOptions, IRescaleImageOptions} from './types';
import {validateImagePath} from '../utils';

/**
 * Class which is responsible for tasks connected with image files.
 */
export class ImageProcessor {
  /**
   * Exports canvas to specified path.
   * @param canvas
   * @param path
   * @private
   */
  private static export(canvas: Canvas, path: string) {
    const buffer = p.parse(path).ext === '.png'
      ? canvas.toBuffer('image/png', {compressionLevel: 9})
      : canvas.toBuffer('image/jpeg', {quality: 1});

    fs.writeFileSync(path, buffer);
  }

  /**
   * Rescales image.
   * @param options
   */
  static async rescale(options: IRescaleImageOptions) {
    const {divisor, outputPath, path} = options;
    validateImagePath(path, 'input');
    validateImagePath(outputPath, 'output');
    const image = await loadImage(
      p.isAbsolute(path)
        ? path
        : p.resolve(process.cwd(), path),
    );
    const widthRaw = image.width / divisor;
    const heightRaw = image.height / divisor;
    const width = Math.floor(widthRaw);
    const height = Math.floor(heightRaw);
    const widthLost = widthRaw - width;
    const heightLost = heightRaw - height;
    const widthDiffers = widthLost > 0;
    const heightDiffers = heightLost > 0;

    if (widthDiffers || heightDiffers) {
      let message: string[] = [];

      if (widthDiffers) {
        message.push(`width - ${widthLost}px`);
      }
      if (heightDiffers) {
        message.push(`height - ${heightLost}px`);
      }
      console.warn(
        'WARNING: Some of pixels where cut while rescaling. Count of ' +
        `cut pixels: ${message.join(', ')}`,
      );
    }
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, width, height);

    // Export canvas.
    this.export(canvas, outputPath);
  }

  /**
   * Makes image pixeled.
   * @param options
   */
  static async pixel(options: IPixelOptions) {
    const {precision, outputPath, path} = options;
    validateImagePath(path, 'input');
    validateImagePath(outputPath, 'output');
    const image = await loadImage(path);
    const width = image.width;
    const height = image.height;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    const wIterCount = Math.ceil(width / precision);
    const hIterCount = Math.ceil(height / precision);
    const precisionSquare = precision ** 2;

    for (let i = 0; i < wIterCount; i++) {
      const x = i * precision;

      for (let j = 0; j < hIterCount; j++) {
        const y = j * precision;
        const imageData = context.getImageData(x, y, precision, precision);
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;

        for (let pixelIndex = 0; pixelIndex < precisionSquare; pixelIndex++) {
          const from = pixelIndex * 4;
          const slice = imageData.data.slice(from, from + 4);
          r += slice[0];
          g += slice[1];
          b += slice[2];
          a += slice[3];
        }
        r /= precisionSquare;
        g /= precisionSquare;
        b /= precisionSquare;
        a /= precisionSquare;

        for (let pixelIndex = 0; pixelIndex < precisionSquare; pixelIndex++) {
          const from = pixelIndex * 4;
          imageData.data[from] = r;
          imageData.data[from + 1] = g;
          imageData.data[from + 2] = b;
          imageData.data[from + 3] = a;
        }

        context.putImageData(imageData, x, y);
      }
    }

    // Export canvas.
    this.export(canvas, outputPath);
  }
}