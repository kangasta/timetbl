import React from 'react';
import { shallow } from 'enzyme';
import App from './../App';
import ErrorMsg from './../ErrorMsg';
import TimeTable from './../TimeTable.js';

describe('App', () => {
	beforeEach( () => {
		Object.defineProperty(window.location, 'href', {
			writable: true,
			value: 'localhost:3000/kara'
		});
	});

	it('renders without crashing', () => {
		shallow(<App />);
	});
	it('shows error when state is updated to error', () => {
		const component = shallow(<App />);

		component.setState(
			{error: {
				name: 'TEST ERROR NAME',
				message: 'TEST ERROR MESSAGE'
			}}
		);
		expect(component.find(ErrorMsg)).toHaveLength(1);
	});
	it('shows timetable when state is updated to valid state', () => {
		const component = shallow(<App />);

		component.setState({lat: 0, lon:0});
		component.update();
		expect(component.find(TimeTable)).toHaveLength(1);
	});
});
