import packageJson from '../package.json';
import {Command, InvalidOptionArgumentError} from 'commander';
import {ImagesProcessor} from 'pxn-core/dist/node';
import {parsePositiveFloat, parsePositiveInt, toAbsolutePath} from './utils';

const program = new Command();
program.name(packageJson.name);
program.version(packageJson.version);

program
  .command('image:cut')
  .description(
    'Removes transparent spaces from image. Final image will have minimal ' +
    'rectangle form it can have without additional transparent spaces.',
  )
  .requiredOption(
    '-s --source <path>',
    'Absolute or relative path to source image. Acceptable ' +
    'extensions are "png", "jpeg" and "jpg"',
  )
  .requiredOption(
    '-o --output <path>',
    'Path where rescaled image should be saved. Should have ' +
    'extensions "png" or "jpeg"',
    './rescaled.png',
  )
  .action(async options => {
    const {source, output} = options;

    await ImagesProcessor.cut({
      path: toAbsolutePath(source),
      outputPath: toAbsolutePath(output),
    });
  });

program
  .command('image:pixel')
  .description('Pixelizes image.')
  .requiredOption(
    '-s --source <path>',
    'Absolute or relative path to source image. Acceptable ' +
    'extensions are "png", "jpeg" and "jpg"',
  )
  .requiredOption(
    '-o --output <path>',
    'Path where rescaled image should be saved. Should have ' +
    'extensions "png" or "jpeg"',
    './pixeled.png',
  )
  .requiredOption(
    '-r --resolution <number>',
    'How many pixels should be taken to create new pixel. Pixels ' +
    'are taken with square which square is equal to resolution ** 2.',
    parsePositiveInt,
  )
  .action(async options => {
    const {source, resolution, output} = options;

    await ImagesProcessor.pixel({
      path: toAbsolutePath(source),
      resolution,
      outputPath: toAbsolutePath(output),
    });
  });

program
  .command('image:resize')
  .description('Resizes image.')
  .requiredOption(
    '-s --source <path>',
    'Absolute or relative path to source image. Acceptable ' +
    'extensions are "png", "jpeg" and "jpg"',
  )
  .requiredOption(
    '-o --output <path>',
    'Path where rescaled image should be saved. Should have ' +
    'extensions "png" or "jpeg"',
    './resized.png',
  )
  .option(
    '-a --auto',
    'Should be image automatically resized to minimum size.',
  )
  .option(
    '-m --multiply <amount>',
    'How much should image dimensions be multiplied',
    parsePositiveFloat,
  )
  .option(
    '-d --divide <number>',
    'How much should image dimensions be divided',
    parsePositiveFloat,
  )
  .action(async options => {
    const {source, multiply, divide, output} = options;
    const nonUndefinedParamsCount = ['auto' in options, multiply, divide]
      .reduce<number>((acc, param) => param === undefined ? acc : acc + 1, 0);

    if (nonUndefinedParamsCount > 1) {
      throw new InvalidOptionArgumentError(
        'It is not allowed several resize parameters at the same time',
      );
    }

    await ImagesProcessor.resize({
      path: toAbsolutePath(source),
      outputPath: toAbsolutePath(output),
      ...('auto' in options
        ? {auto: true}
        : {
          config: typeof multiply === 'number'
            ? {type: 'multiply', amount: multiply}
            : {type: 'divide', amount: divide},
        }),
    });
  });

//  TODO
// program
//   .command('animation:create')
//   .description('Creates animation config')
//   .requiredOption(
//     '-c --config <path>',
//     'Absolute or relative path to animation config'
//   )
//   .action(async options => {
//     const {config: configPath} = options;
//     const path = toAbsolutePath(configPath);
//
//     await AnimationsProcessor.create({
//
//     });
//   });

// Launch program.
program.parse(process.argv);