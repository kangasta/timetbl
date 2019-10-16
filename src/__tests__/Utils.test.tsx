import React from 'react';
import { mount } from 'enzyme';

import {
  DestinationItem,
  AlertSymbol,
  TimeUtils,
  getField,
  getUniqueFilter
} from '../Utils';

describe('DestinationItem', () => {
  it('replaces (M) as M wrapped in span', () => {
    ['Kamppi', 'Kamppi (M)'].forEach(destination => {
      const wrapper = mount(<DestinationItem destination={destination} />);

      expect(wrapper.text()).toEqual(destination.replace(/[\s()]/g, ''));
      expect(wrapper.exists({ className: 'Metro', children: 'M' })).toBe(
        destination.includes('(M)')
      );
    });
  });
});

describe('AlertSymbol', () => {
  it('renders without crashing', () => {
    mount(<AlertSymbol />);
  });
});

describe('currentTimeInMinutes', () => {
  it('returns current time of day in minutes', () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2000, 0, 0, 1, 1).getTime());
    expect(TimeUtils.currentTimeInMinutes()).toBeLessThanOrEqual(24 * 60);
  });
});

describe('parseHour', () => {
  it('is not larger that 23 and is integer', () => {
    [
      { in: 24 * 3600, out: 0 },
      { in: 26 * 3600, out: 2 },
      { in: 26 * 3600 + 1830, out: 2 },
      { in: 3 * 3600 + 1234, out: 3 }
    ].forEach(test => {
      expect(TimeUtils.parseHour(test.in)).toBe(test.out);
    });
  });
});

describe('parseTime', () => {
  it('adds leading zero to minutes and leading space to hours', () => {
    [
      { in: 10 * 3600 + 6 * 60, out: '10:06' },
      { in: 10 * 3600 + 16 * 60, out: '10:16' },
      { in: 9 * 3600 + 0 * 60, out: ' 9:00' },
      { in: 26 * 3600 + 16 * 60, out: ' 2:16' }
    ].forEach(test => {
      expect(TimeUtils.parseTime(test.in)).toBe(test.out);
    });
  });
  it('allows custom deliminator', () => {
    expect(TimeUtils.parseTime(22 * 3600 + 45 * 60, '&')).toBe('22&45');
  });
});

describe('departureTimeToStr', () => {
  it('shows minutes left, if departure in next ten minutes', () => {
    expect(
      TimeUtils.departureTimeToStr((TimeUtils.currentTimeInMinutes() + 5) * 60)
    ).toMatch(/5\smin/);
    expect(
      TimeUtils.departureTimeToStr(TimeUtils.currentTimeInMinutes() * 60)
    ).toMatch(/0\smin/);

    const mock = jest
      .spyOn(TimeUtils, 'currentTimeInMinutes')
      .mockImplementation(() => 23 * 60 + 59);
    expect(
      TimeUtils.departureTimeToStr((TimeUtils.currentTimeInMinutes() + 5) * 60)
    ).toMatch(/5\smin/);

    mock.mockImplementation(() => 24 * 60);
    expect(
      TimeUtils.departureTimeToStr(TimeUtils.currentTimeInMinutes() * 60)
    ).toMatch(/0\smin/);
  });
  it('shows departure time, if departure not in next ten minutes', () => {
    expect(
      TimeUtils.departureTimeToStr((TimeUtils.currentTimeInMinutes() + 10) * 60)
    ).toMatch(/[0-9]{1,2}.[0-9]{2,2}/);
    expect(
      TimeUtils.departureTimeToStr((TimeUtils.currentTimeInMinutes() - 3) * 60)
    ).toMatch(/[0-9]{1,2}.[0-9]{2,2}/);

    const mock = jest
      .spyOn(TimeUtils, 'currentTimeInMinutes')
      .mockImplementation(() => 23 * 60 + 59);
    expect(
      TimeUtils.departureTimeToStr((TimeUtils.currentTimeInMinutes() + 11) * 60)
    ).toMatch(/[0-9]{1,2}.[0-9]{2,2}/);

    mock.mockImplementation(() => 24 * 60);
    expect(
      TimeUtils.departureTimeToStr(TimeUtils.currentTimeInMinutes() * 60 - 3)
    ).toMatch(/[0-9]{1,2}.[0-9]{2,2}/);
  });
});

describe('getField', () => {
  it('get field described by string from object', () => {
    expect(getField([{ a: { b: [0, 1] } }], '[0].a.b[1]')).toEqual(1);
    expect(getField({}, 'a.b')).toEqual(undefined);
  });
});

describe('getUniqueFilter', () => {
  it('can be used to filter array to have unique member only', () => {
    const arr = [{ a: [0] }, { a: [0] }, { a: [1] }, { a: [1] }];
    expect(arr.filter(getUniqueFilter('a[0]'))).toEqual([
      { a: [0] },
      { a: [1] }
    ]);
  });
});
