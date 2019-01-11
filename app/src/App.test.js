import React from 'react';
import { mount, shallow } from 'enzyme';
import App from './App';
import { TimeTable } from 'timetbl';

describe('App', () => {
	it('renders without crashing', () => {
		shallow(<App />);
	});
	it('shows error when state is updated to error', () => {
		const component = mount(<App />);

		component.setState({view: {
			error: 'error'
		}});
		expect(component.find('.cs-error')).toBeTruthy(); // TODO: Add error prefix and use toHaveLenght
	});
	it('shows timetable when state is updated to valid state', () => {
		const component = shallow(<App />);

		component.setState({
			view: {nearby: null},
			coords: {lat: 0, lon:0, r:0}
		});
		component.update();
		expect(component.find(TimeTable)).toHaveLength(1);
	});
});
