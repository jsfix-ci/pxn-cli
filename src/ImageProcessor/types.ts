export interface IRescaleImageOptions {
  /**
   * Path to image file. Acceptable extensions are "png", "jpg" and "jpeg".
   */
  path: string;
  /**
   * How many pixels in original image represents 1 pixel in rendered image.
   * So, if original image has resolution of 120x60 and divisor is 3, it
   * will be rescaled to 40x20. So, it means that 3 pixels in original image
   * will be 1 in rendered.
   *
   * Make sure, that this method only rescales image.
   */
  divisor: number;
  /**
   * Path to output file. Acceptable extensions are "png" or "jpeg".
   */
  outputPath: string;
}

export interface IPixelOptions {
  /**
   * Path to image file. Acceptable extensions are "png", "jpg", "jpeg" and
   * "svg".
   */
  path: string;
  /**
   * How many pixels should be taken to create new pixel. Pixels are taken
   * with square which square is equal to precision ** 2.
   */
  precision: number;
  /**
   * Path to output file. Acceptable extensions are "png" or "jpeg".
   */
  outputPath: string;
}