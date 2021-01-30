import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { NavBar } from '../Components';

describe('NavBar', () => {
  it('renders without crashing', () => {
    render(<NavBar buttons={[{ text: 'a', onClick: () => undefined }]} />);
  });
  it('allows omitting className, disabled, and onClick', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <NavBar buttons={[{ text: 'a', onClick: onClick }]} />
    );

    const link = getByText('a');
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it.each([[true], [false]])(
    'maps provided buttons to navbar and disables onClick when component is disabled: %s',
    (disabled: boolean) => {
      const onClick = jest.fn();
      const { getByText } = render(
        <NavBar buttons={[{ text: 'a', disabled, onClick: onClick }]} />
      );

      const button = getByText('a');
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(disabled ? 0 : 1);
    }
  );
});
