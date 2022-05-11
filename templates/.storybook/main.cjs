const fs = require('fs');

const rootDir = fs.realpathSync(process.cwd());

module.exports = {
  stories: [rootDir + '/src/**/*.stories.mdx', rootDir + '/src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
    'storybook-dark-mode',
  ],
  webpackFinal: async (config) => {
    config.stats = 'errors-only';
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
};
