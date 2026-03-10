import { describe, expect, test } from 'vitest';
import { render } from '@testing-library/react';

import { MyAwesomeApp } from './MyAwesomeApp';

describe('MyAwesomeApp', () => {
  test('should render firstName and lastName', () => {
    const { container } = render(<MyAwesomeApp />);
    // screen.debug();
    // console.log(container.innerHTML);

    const h2 = container.querySelector('h2');

    expect(h2?.innerHTML).toContain('Ross');
    expect(h2?.innerHTML).toContain('Cabrera');
  });

  // test('should render firstName and lastName - screen', () => {
  //   render(<MyAwesomeApp />);
  //   screen.debug();
  //   console.log(container.innerHTML);

  //   const h1 = screen.getByRole('heading', {
  //     level: 1,
  //   });
  //   const h1 = screen.getByTestId('first-name-title');
  //   expect(h1.innerHTML).toContain('Fernando');
  // });

  test('should match snapshot', () => {
    const { container } = render(<MyAwesomeApp />);
    expect(container).toMatchSnapshot();
  });

  // test('should match snapshot', () => {
  //   render(<MyAwesomeApp />);
  //   expect(screen.getByTestId('div-app')).toMatchSnapshot();
  // });
});
