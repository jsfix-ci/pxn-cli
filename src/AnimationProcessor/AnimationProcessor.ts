import {
  ICreateOptions,
  IAnimationConfig,
} from './types';
import {
  calculateOffset,
  getImageDataDiff,
  getOffset,
  imageToBase64,
  loadFrame,
} from './utils';
import {createCanvas} from 'canvas';
import fs from 'fs';

export class AnimationProcessor {
  static async create(options: ICreateOptions) {
    const {frames} = options;

    if (frames.length === 0) {
      throw new Error('No frames were passed');
    }
    // Check if each frame has correct settings.
    const loadedFrames = await Promise.all(frames.map(loadFrame));
    let maxFrameHeight = 0;
    let maxFrameWidth = 0;

    // Find max frames height and width.
    loadedFrames.forEach(f => {
      maxFrameHeight = Math.max(maxFrameHeight, f.height);
      maxFrameWidth = Math.max(maxFrameWidth, f.width);
    });
    const {
      height: canvasHeight = maxFrameHeight,
      width: canvasWidth = maxFrameWidth,
      assetsType,
      cut,
      outputPath,
    } = options;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const context = canvas.getContext('2d');
    const config: IAnimationConfig = {frames: [], offsets: [0, 0, 0, 0]};

    if (cut) {

    } else {
      loadedFrames.forEach((f, idx) => {
        const {image, width, height, left, duration, top, path} = f;

        if (idx === 0) {
          context.drawImage(image, left, top, width, height);
          config.frames.push({
            ...(assetsType === 'path' ? {path} : {image: canvas.toDataURL()}),
            duration,
            left,
            top,
          });
        } else {
          // Find difference with previous frame.
          const prevImageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
          context.drawImage(image, left, top, width, height);
          const currentImageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
          const diff = getImageDataDiff(currentImageData, prevImageData);

          const tempCanvas = createCanvas(canvasWidth, canvasHeight);
          tempCanvas.getContext('2d').putImageData(diff, 0, 0);

          // FIXME: Path должен быть другой
          config.frames.push({
            ...(assetsType === 'path'
              ? {path}
              : {image: tempCanvas.toDataURL()}),
            duration,
            left,
            top,
          });
        }
      });
    }

    if (assetsType === 'base64') {
      fs.writeFileSync(outputPath, JSON.stringify(config));
    }

    // loadedFrames.forEach((f, idx) => {
    //   const {image, width, height, left, duration, top, path} = f;
    //   const right = calculateOffset(canvasWidth, width, left);
    //   const bottom = calculateOffset(canvasHeight, height, top);
    //   const [offsetTop, offsetRight, offsetBottom, offsetLeft] = config.offsets;
    //   config.offsets[0] = getOffset(offsetTop, top);
    //   config.offsets[1] = getOffset(offsetRight, right);
    //   config.offsets[2] = getOffset(offsetBottom, bottom);
    //   config.offsets[3] = getOffset(offsetLeft, left);
    //   prevImageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
    //
    //   if (idx === 0) {
    //     config.frames.push({
    //       duration,
    //       left,
    //       ...(assetsType === 'path' ? {path} : {image: imageToBase64(image)}),
    //       top,
    //     });
    //   }
    //   context.drawImage(f.image);
    // });
  }
}