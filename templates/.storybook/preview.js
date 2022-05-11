import { create } from '@storybook/theming';

const lightTheme = create({
  base: 'light',
  appBg: 'white',
  colorPrimary: '#9ED1F3',
  colorSecondary: '#9ED1F3',
  brandImage: 'https://res.cloudinary.com/infotition/image/upload/v1637524234/Brand_1_ikjeuq.png',
});

const darkTheme = create({
  base: 'dark',
  appBg: '#292D3E',
  colorPrimary: '#9ED1F3',
  colorSecondary: '#9ED1F3',
  appContentBg: '#292D3E',
  inputBg: '#292D3E',
  barBg: '#313446',
  brandImage: 'https://res.cloudinary.com/infotition/image/upload/v1637523984/Brand_ui9lrt.png',
});

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  darkMode: {
    dark: darkTheme,
    light: lightTheme,
    stylePreview: true,
  },
  layout: 'fullscreen',
};
