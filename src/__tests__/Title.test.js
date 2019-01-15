import React from 'react';
import { mount, shallow } from 'enzyme';
import Title from './../Title';

describe('Title', () => {
	it('renders without crashing', () => {
		mount(<Title />);
	});
	it('displays clock if asked', () => {
		[true, false].forEach(clock => {
			const wrapper = shallow(<Title clock={clock}/>);

			expect(wrapper.exists('.Clock')).toBe(clock);
			if (clock) expect(wrapper.find('.Clock').text()).toMatch(/[0-9]{1,2}.[0-9]{2}/);
		});
	});
	// TODO test that time is being updated
	it('displays either coordinates or text', () => {
		[
			{text: 'Title', has: '.Code', hasNot: '.Coord'},
			{text: 'Title', lat: 60, lon: 24, has: '.Code', hasNot: '.Coord'},
			{lat: 60, lon: 24, has: '.Coord', hasNot: '.Code'}
		].forEach(test => {
			const wrapper = shallow(<Title text={test.text} lat={test.lat} lon={test.lon}/>);

			expect(wrapper.exists(test.has)).toBe(true);
			expect(wrapper.exists(test.hasNot)).toBe(false);
		});
	});
});
