import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { DepartureInfo } from '../Components';
import { getField } from '../Utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stoptimes = require('../__mocks__/StoptimesWithAlert.json');

describe('DepartureInfo', () => {
  it('renders without crashing', () => {
    render(<DepartureInfo stoptimes={stoptimes} />);
  });
  it('renders alert either as icon or detailed text', () => {
    const { getAllByTestId, queryAllByTestId } = render(
      <DepartureInfo stoptimes={stoptimes} />
    );

    [true, false, true].forEach((symbol) => {
      const visible = symbol ? 'symbol' : 'text';
      const hidden = symbol ? 'text' : 'symbol';

      getAllByTestId(`departure-alert-${visible}`);
      expect(queryAllByTestId(`departure-alert-${hidden}`)).toHaveLength(0);

      fireEvent.click(
        getAllByTestId(`departure-alert-${symbol ? 'symbol' : 'text'}`)[0]
      );
    });
  });
  it('does not include stop details by default', () => {
    const { container } = render(<DepartureInfo stoptimes={stoptimes} />);

    expect(container.textContent).not.toContain(
      getField(stoptimes, '[0].stop.name')
    );
  });
  it('shows stop details if required by props', () => {
    const distance = 100;
    const { container } = render(
      <DepartureInfo
        stoptimes={stoptimes}
        showPlatform
        showStopName
        distance={distance}
      />
    );

    const text = container.textContent;
    expect(text).toContain(getField(stoptimes, '[0].stop.name'));
    expect(text).toContain(`${distance} m`);

    const platform = getField(stoptimes, '[0].stop.platformCode');
    if (platform) {
      expect(text).toContain(`Platform ${platform}`);
    } else {
      expect(text).toContain(`Stop ${getField(stoptimes, '[0].stop.code')}`);
    }
  });
});
