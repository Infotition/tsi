import { execSync } from 'child_process';
import { copyFileSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { appRoot } from '../utils/constants';

export type PublishOpts = {
  /** Whether the npm module should get published or not. */
  dry: boolean;
  /** Whether the bundle should get deleted after publish. */
  clean: boolean;
};

export const publishAction = async ({ dry, clean }: PublishOpts) => {
  const cwd = process.cwd();

  if (!existsSync(resolve(cwd, 'lib'))) {
    return console.log(
      chalk.bold.red(
        'You must build the project before you can publish it.\n  - Try running yarn build or npm run build.\n  - Or run the tsi build script directly.',
      ),
    );
  }

  const spinner = ora();

  spinner.start(chalk.bold.cyan('Bundling package...'));

  if (existsSync(resolve(cwd, 'package'))) {
    rmSync(resolve(cwd, 'package'), { recursive: true });
  }

  execSync(`npx clean-publish --without-publish --temp-dir package --clean-docs`);

  // Replace table of contents details and back to top link
  let readMe = readFileSync(resolve(cwd, 'package', 'README.md')).toString();
  readMe = readMe.replaceAll(/<details>(.|\n)*<\/details>\n*/gm, '');
  readMe = readMe.replaceAll(/<p align="right">\(<a href="#top">back to top<\/a>\)<\/p>\n*/gm, '');
  writeFileSync(resolve(cwd, 'package', 'README.md'), readMe);

  const filter = ['LICENSE', 'lib', 'package.json', 'README.md'];

  const files = readdirSync(cwd);

  for (const file of files) {
    if (filter.includes(file)) continue;

    if (existsSync(resolve(cwd, 'package', file))) {
      rmSync(resolve(cwd, 'package', file), { recursive: true });
    }
  }

  for (let i = 0; i < 3; i += 1) {
    const licensePath = join(appRoot, '../'.repeat(i), 'LICENSE');

    if (existsSync(licensePath)) {
      copyFileSync(licensePath, resolve(cwd, 'package/LICENSE'));
      break;
    }
  }

  spinner.succeed(chalk.bold.green('Bundling successful.'));

  const authToken = process.env.NPM_TOKEN;

  console.log(authToken);

  const withAuth = authToken ? `npx cross-env NODE_AUTH_TOKEN=${authToken} ` : '';
  const withDry = dry ? '--dry-run' : '';
  const publishCommand = `cd package&&${withAuth}npm publish ${withDry} --access public`;

  if (dry) {
    execSync(publishCommand);
  } else {
    const localVersion = JSON.parse(readFileSync(resolve(cwd, 'package.json')).toString()).version;
    const remoteVersion = execSync('npm view . version', { encoding: 'utf-8' }).trim();

    if (localVersion !== remoteVersion) {
      execSync(publishCommand);
    } else {
      console.log(chalk.bold.red('Package already up to date.'));
    }
  }

  if (clean) {
    rmSync(resolve(cwd, 'package'), { recursive: true });
  }
};
