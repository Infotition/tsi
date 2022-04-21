<div align="center">
	<br />
	<p>
		<a href="http://infotition.de">
			<img src="https://raw.githubusercontent.com/Infotition/tsi/main/.github/assets/infotition_logo.png" width=600px alt="infotition logo" />
		</a>
	</p>
	<h1>TSI</h1>
	<p>Infotition's zero-config CLI for TypeScript node package development.</p>
  	<p>
    <a href="https://github.com/Infotition/tsi/actions/workflows/deploy.yml" title="build state">
			<img alt="build state" src="https://github.com/Infotition/tsi/actions/workflows/deploy.yml/badge.svg">
		</a>
		<a href="https://github.com/Infotition/tsi/blob/main/LICENSE" title="license">
			<img src="https://img.shields.io/github/license/Infotition/tsi" alt="license" />
		</a>
	</p>
</div>

# Features

- Bundles your code with [Rollup](https://github.com/rollup/rollup) for development or production builds.
- Supports treeshaking and minification/compression.
- Live reload feature
- Typescript with [sass](https://sass-lang.com/) support
- [Jest](https://jestjs.io/) test runner setup
- [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) setup 
- Zero-config, single dependency

## Quick Start
```bash
npx @infotition/tsi create --template basic mypackage
cd mypackage
yarn dev
```

That's all you need to do. You don't need to worry about setting up TypeScript or Rollup or Jest or other annoying tasks. Just start editing `src/index.ts`.

## Scripts

- `yarn dev`    - Starts the development build and rebuilds after src files changes. 
- `yarn test`   - Starts the jest test runner.
- `yarn build`  - Bundles the source files into a production file.
- `yarn lint`   - Starts to lint the source files.
- `yarn deploy` - Creates a production version of the package and publish's it to npm.
- `yarn clean`  - Deletes the `lib`, `package` and if wanted the `node_module` folders.

## Contribution

We appreciate feedback and contribution to this repo! Before you get started, please see the following:

- [Infotition Code of Conduct guidelines](./.github/CODE_OF_CONDUCT.md)
- [Infotition Contribution guidelines](./.github/CONTRIBUTING.md)

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. For other related questions/support please use the official Infotition [Discord server](https://discord.gg/NpxrDGYDwV).

## License

This repo is covered under the MIT License, see the [LICENSE](./LICENSE) file for more information.
