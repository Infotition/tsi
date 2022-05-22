import { render, screen } from '@testing-library/react';

import { Button } from '../src';

it('should render button', () => {
  render(<Button />);
  const btn = screen.getByTestId('btn');
  expect(btn).toHaveTextContent('Hello World');
});
