import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { NavList } from '../Components';

describe('NavList', () => {
  it('renders without crashing', () => {
    render(<NavList buttons={[{ text: 'a', onClick: () => undefined }]} />);
  });
  it('allows omitting className, disabled, and onClick', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <NavList buttons={[{ text: 'a', onClick: onClick }]} />
    );

    const link = getByText('a');
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it.each([[true], [false]])(
    'maps provided buttons to NavList and disables onClick when component is disabled: %s',
    (disabled: boolean) => {
      const onClick = jest.fn();
      const { getByText } = render(
        <NavList buttons={[{ text: 'a', disabled, onClick: onClick }]} />
      );

      const button = getByText('a');
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(disabled ? 0 : 1);
    }
  );
});
