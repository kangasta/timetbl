import React from 'react';
import { mount, shallow } from 'enzyme';

import { DepartureInfo } from '../timetbl';

describe('DepartureInfo', () => {
	it('renders without crashing', () => {
		mount(<DepartureInfo stoptime={[{
			trip: {
				route: {
					shortName: 'Route',
					mode: 'Type',
					alerts: []
				}
			},
			realtimeArrival: 0,
			realtimeDeparture: 0,
			realtime: false,
			headsign: 'Destination'
		}]}/>);
	});
	it('renders alert either as icon or detailed text', () => {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const stoptime = require('../__mocks__/StoptimesWithAlert.json');
		const wrapper = shallow(<DepartureInfo stoptime={stoptime}/>);

		[true, false, true].forEach(symbol => {
			expect(wrapper.exists('.AlertSymbol')).toBe(symbol);
			expect(wrapper.exists('.AlertText')).toBe(!symbol);

			wrapper.find(symbol ? '.AlertSymbol' : '.AlertText').simulate('click');
		});
	});
	/* TODO update
	it('shows stop info if stop is given in props.', () => {
		const component = mount(<DepartureInfo stop={{name: 'SOME NAME'}}/>);

		expect(component.find('li.stop')).toHaveLength(1);
		expect(component.find('li.stop').everyWhere(i => i.hasClass('hide'))).toBeFalsy();
	});
	it('hides stop info if no stop is given in props.', () => {
		const component = mount(<DepartureInfo />);

		expect(component.find('li.stop')).toHaveLength(1);
		expect(component.find('li.stop').everyWhere(i => i.hasClass('hide'))).toBeTruthy();
	});
	it('shows stop info if header type is nearest.', () => {
		const component = mount(<DepartureInfo header='nearest'/>);

		expect(component.find('li.stop')).toHaveLength(1);
		expect(component.find('li.stop').everyWhere(i => i.hasClass('hide'))).toBeFalsy();
	});
	it('hides stop info if header type is stop.', () => {
		const component = mount(<DepartureInfo header='stop'/>);

		expect(component.find('li.stop')).toHaveLength(1);
		expect(component.find('li.stop').everyWhere(i => i.hasClass('hide'))).toBeTruthy();
	});
	*/
});

describe('DepartureInfo.currentTimeInMinutes', () => {
	it('is not larger that 24*60', () => {
		expect(DepartureInfo.currentTimeInMinutes()).toBeLessThanOrEqual(24*60);
	});
});

describe('DepartureInfo.parseHour', () => {
	it('is not larger that 23 and is integer', () => {
		[
			{in: 24*3600, out: 0},
			{in: 26*3600, out: 2},
			{in: 26*3600+1830, out: 2},
			{in: 3*3600+1234, out: 3},
		].forEach(test => {
			expect(DepartureInfo.parseHour(test.in)).toBe(test.out);
		});
	});
});

describe('DepartureInfo.parseTime', () => {
	it('adds leading zero to minutes and leading space to hours', () => {
		[
			{in: 10*3600+6*60, out: '10:06'},
			{in: 10*3600+16*60, out: '10:16'},
			{in: 9*3600+ 0*60, out: ' 9:00'},
			{in: 26*3600+16*60, out: ' 2:16'}
		].forEach(test => {
			expect(DepartureInfo.parseTime(test.in)).toBe(test.out);
		});
	});
	it('allows custom deliminator', () => {
		expect(DepartureInfo.parseTime(22*3600+45*60, '&')).toBe('22&45');
	});
});

describe('DepartureInfo.departureTimeToStr', () => {
	/*it('starts with tilde if not in real time', () => {
		expect(DepartureInfo.departureTimeToStr(22*3600+45*60, false)).toMatch(/^~/);
		expect(DepartureInfo.departureTimeToStr(22*3600+45*60)).toMatch(/^~/);
	});
	it('starts with space if in real time', () => {
		expect(DepartureInfo.departureTimeToStr(22*3600+45*60, true)).toMatch(/^\s/);
	});*/
	it('shows minutes left, if departure in next ten minutes', () => {
		expect(DepartureInfo.departureTimeToStr((DepartureInfo.currentTimeInMinutes() + 5)*60))
			.toMatch(/5\smin/);
		expect(DepartureInfo.departureTimeToStr(DepartureInfo.currentTimeInMinutes()*60))
			.toMatch(/0\smin/);

		DepartureInfo.currentTimeInMinutes = jest.fn(() => 23*60+59);
		expect(DepartureInfo.departureTimeToStr((DepartureInfo.currentTimeInMinutes() + 5)*60))
			.toMatch(/5\smin/);

		DepartureInfo.currentTimeInMinutes = jest.fn(() => 24*60);
		expect(DepartureInfo.departureTimeToStr((DepartureInfo.currentTimeInMinutes())*60))
			.toMatch(/0\smin/);
	});
	it('shows departure time, if departure not in next ten minutes', () => {
		expect(DepartureInfo.departureTimeToStr((DepartureInfo.currentTimeInMinutes() + 10)*60))
			.toMatch(/[0-9]{1,2}.[0-9]{2,2}/);
		expect(DepartureInfo.departureTimeToStr((DepartureInfo.currentTimeInMinutes() - 3)*60))
			.toMatch(/[0-9]{1,2}.[0-9]{2,2}/);

		DepartureInfo.currentTimeInMinutes = jest.fn(() => 23*60+59);
		expect(DepartureInfo.departureTimeToStr((DepartureInfo.currentTimeInMinutes() + 11)*60))
			.toMatch(/[0-9]{1,2}.[0-9]{2,2}/);

		DepartureInfo.currentTimeInMinutes = jest.fn(() => 24*60);
		expect(DepartureInfo.departureTimeToStr((DepartureInfo.currentTimeInMinutes())*60 - 3))
			.toMatch(/[0-9]{1,2}.[0-9]{2,2}/);
	});
});
