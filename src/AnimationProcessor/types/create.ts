import {TAnimationFrame} from './shared';

export interface ICreateOptions {
  /**
   * Animation final height.
   * @default Max frame's height.
   */
  height?: number;
  /**
   * Animation final width.
   * @default Max frame's width.
   */
  width?: number;
  /**
   * Frames options.
   */
  frames: TAnimationFrame[];
  /**
   * Should transparent spaces be removed from resulting animation. It is
   * useful to apply this option to minimize the size of animation and reduce
   * cpu load while rendering it.
   *
   * In case of true, it is not guaranteed that resulting animation will have
   * passed height and width. Additionally, resulting config will have
   * information about removed spaces.
   * @default true
   */
  cut?: boolean;
  /**
   * Only paths to files should be saved or their base64 representation.
   */
  assetsType: 'path' | 'base64';
  /**
   * Path to directory where all the assets and config will be saved. In case
   * assetsType = base64, config file will be created.
   */
  outputPath: string;
}

interface IAnimationFrameProps {
  /**
   * Time in milliseconds, how long this frame should stay.
   */
  duration: number;
  /**
   * Top offset.
   */
  top: number;
  /**
   * Left offset.
   */
  left: number;
}

interface IBase64AnimationFrame extends IAnimationFrameProps {
  /**
   * Base64 representation of frame.
   */
  image: string;
}

interface IDefaultAnimationFrame extends IAnimationFrameProps {
  /**
   * Relative path to image.
   */
  path: string;
}

export interface IAnimationConfig {
  /**
   * List of generated frames.
   */
  frames: (IBase64AnimationFrame | IDefaultAnimationFrame)[];
  /**
   * Top, right, bottom and left offsets in pixels. Shows how many pixels
   * are transparent on each side.
   */
  offsets: [number, number, number, number];
}
