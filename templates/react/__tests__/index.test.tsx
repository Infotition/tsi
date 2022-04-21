import { render, screen } from '@testing-library/react';
import React from 'react';

import { Button } from '../src/index';

it('should render button', () => {
  render(<Button />);
  const btn = screen.getByTestId('btn');
  expect(btn).toHaveTextContent('Hello World 42');
});
