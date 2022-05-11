const fs = require('fs');
const path = require('path');

const rootDir = fs.realpathSync(process.cwd());

module.exports = {
  stories: [rootDir + '/src/**/*.stories.mdx', rootDir + '/src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-postcss',
      options: {
        cssLoaderOptions: {
          importLoaders: 1,
        },
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
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: true,
          },
        },
        'sass-loader',
      ],
      include: /\.module\.scss/,
    });
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      exclude: /\.module\.scss/,
      include: path.resolve(__dirname, '../'),
    });
    return config;
  },
};
