import React from 'react';
import { mount, shallow } from 'enzyme';

import { Title } from '../Components/Title';

describe('Title', () => {
	it('renders without crashing', () => {
		mount(<Title clock={true}/>);
	});
	it('displays clock if asked', () => {
		[true, false].forEach(clock => {
			const wrapper = shallow(<Title clock={clock}/>);

			expect(wrapper.exists('.Clock')).toBe(clock);
			if (clock) expect(wrapper.find('.Clock').text()).toMatch(/[0-9]{1,2}.[0-9]{2}/);
		});
	});
	// TODO: check clock is updated
	it('displays either coordinates or text', () => {
		[
			{title: 'Title', has: '.Code', hasNot: '.Coord'},
			{title: 'Title', lat: 60, lon: 24, has: '.Code', hasNot: '.Coord'},
			{lat: 60, lon: 24, has: '.Coord', hasNot: '.Code'},
			{stopCodes: ['1','2','3'], has: '.Code', hasNot: '.Coord'}
		].forEach(test => {
			const wrapper = shallow(<Title clock={true} {...test}/>);

			expect(wrapper.exists(test.has)).toBe(true);
			expect(wrapper.exists(test.hasNot)).toBe(false);
		});
	});
});
