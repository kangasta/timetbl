import React from 'react';
import { render } from '@testing-library/react';

import { Title } from '../Components/Title';

describe('Title', () => {
  it('renders without crashing', () => {
    render(<Title clock={true} />);
  });
  it.each([[true], [false]])(
    'displays clock if asked: %s',
    (clock: boolean) => {
      const { container } = render(<Title clock={clock} />);

      const timeRe = /[0-9]{1,2}.[0-9]{2}/;
      if (clock) {
        expect(container.textContent).toMatch(timeRe);
      } else {
        expect(container.textContent).not.toMatch(timeRe);
      }
    }
  );
  // TODO: check clock is updated
  it.each([
    [{ title: 'Title', has: 'Title' }],
    [{ title: 'Title', lat: 60, lon: 24, has: 'Title', hasNot: 'N 60' }],
    [{ lat: 60, lon: 24, has: 'N 60' }],
    [{ stopCodes: ['1', '2', '3'], has: '1 2 3' }],
  ] as any[])(
    'displays either coordinates or text',
    ({ has, hasNot, ...props }) => {
      const { container } = render(<Title clock={true} {...props} />);

      if (has) {
        expect(container.textContent).toContain(has);
      }
      if (hasNot) {
        expect(container.textContent).not.toContain(hasNot);
      }
    }
  );
});
