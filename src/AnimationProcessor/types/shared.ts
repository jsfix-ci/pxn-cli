import {TSourceImagePath} from '../../types';
import {Image} from 'canvas';

export type TAnimationFrame = {
  /**
   * Path to source image file.
   */
  path: TSourceImagePath;
  /**
   * Time in milliseconds, how long this frame should stay.
   */
  duration: number;
  /**
   * Frame top offset.
   * @default 0.
   */
  top?: number;
  /**
   * Frame left offset.
   * @default 0.
   */
  left?: number;
  /**
   * Frame height.
   * @default Image height.
   */
  height?: number;
  /**
   * Frame width.
   * @default Image width.
   */
  width?: number;
}
// & (
//   | {scale?: number}
//   | {width?: number}
//   | {height?: number}
//   )

export type TLoadedAnimationFrame = TAnimationFrame & {
  height: number;
  width: number;
  left: number;
  top: number;
  /**
   * Loaded image.
   */
  image: Image;
}