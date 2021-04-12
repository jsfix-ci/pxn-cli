import packageJson from '../package.json';
import {Command, InvalidOptionArgumentError} from 'commander';
import {ImageProcessor} from './ImageProcessor';

/**
 * Parses value as positive float number.
 * @param value
 */
function parsePositiveFloat(value: string): number {
  const parsedValue = parseFloat(value);

  if (isNaN(parsedValue) || parsedValue < 0) {
    throw new InvalidOptionArgumentError('Should be positive float number');
  }
  return parsedValue;
}

/**
 * Parses value as positive whole number.
 * @param value
 */
function parsePositiveInt(value: string): number {
  const parsedValue = parseInt(value, 10);

  if (isNaN(parsedValue) || parsedValue < 0) {
    throw new InvalidOptionArgumentError('Should be positive whole number');
  }
  return parsedValue;
}

// Create program, set name and version.
const program = new Command();
program.name(packageJson.name);
program.version(packageJson.version);

program
  .command('rescale')
  .description('Rescales image')
  .requiredOption(
    '-s --source <path>',
    'Absolute or relative path to source image. Acceptable ' +
    'extensions are "png", "jpeg" and "jpg"'
  )
  .requiredOption(
    '-o --output <path>',
    'Path where rescaled image should be saved. Should have ' +
    'extensions "png" or "jpeg"',
    './rescaled.png'
  )
  .requiredOption(
    '-d --divisor <number>',
    'How many pixels in original image should represent 1 pixel ' +
    'in rendered image',
    parsePositiveFloat,
  )
  .action(async options => {
    const {source, divisor, output} = options;

    await ImageProcessor.rescale({
      path: source,
      divisor,
      outputPath: output,
    });
  });

program
  .command('pixel')
  .description('Pixelizes image')
  .requiredOption(
    '-s --source <path>',
    'Absolute or relative path to source image. Acceptable ' +
    'extensions are "png", "jpeg" and "jpg"'
  )
  .requiredOption(
    '-o --output <path>',
    'Path where rescaled image should be saved. Should have ' +
    'extensions "png" or "jpeg"',
    './pixeled.png'
  )
  .requiredOption(
    '-p --precision <number>',
    'How many pixels should be taken to create new pixel. Pixels ' +
    'are taken with square which square is equal to precision ** 2.',
    parsePositiveInt,
  )
  .action(async options => {
    const {source, precision, output} = options;

    await ImageProcessor.pixel({
      path: source,
      precision,
      outputPath: output,
    });
  });

// Launch program.
program.parse(process.argv);