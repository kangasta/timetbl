import React from 'react';
import { mount } from 'enzyme';

import { DepartureInfo } from '../Components';
import { getField } from '../Utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const stoptimes = require('../__mocks__/StoptimesWithAlert.json');

describe('DepartureInfo', () => {
  it('renders without crashing', () => {
    mount(<DepartureInfo stoptimes={stoptimes} />);
  });
  it('renders alert either as icon or detailed text', () => {
    const wrapper = mount(<DepartureInfo stoptimes={stoptimes} />);

    [true, false, true].forEach(symbol => {
      expect(wrapper.exists('.AlertSymbol')).toBe(symbol);
      expect(wrapper.exists('.AlertText')).toBe(!symbol);

      wrapper
        .find(symbol ? '.AlertSymbol' : '.AlertText')
        .first()
        .simulate('click');
    });
  });
  it('does not include stop details by default', () => {
    const wrapper = mount(<DepartureInfo stoptimes={stoptimes} />);

    expect(wrapper.exists('.Details')).toBe(false);
  });
  it('shows stop details if required by props', () => {
    const distance = 100;
    const wrapper = mount(
      <DepartureInfo
        stoptimes={stoptimes}
        showPlatform
        showStopName
        distance={distance}
      />
    );

    const text = wrapper.find('div.Details').text();
    expect(text).toContain(`${getField(stoptimes, '[0].stop.name')}`);
    expect(text).toContain(`${distance} m`);

    const platform = getField(stoptimes, '[0].stop.platformCode');
    if (platform) {
      expect(text).toContain(`Platform ${platform}`);
    } else {
      expect(text).toContain(`Stop ${getField(stoptimes, '[0].stop.code')}`);
    }
  });
});
