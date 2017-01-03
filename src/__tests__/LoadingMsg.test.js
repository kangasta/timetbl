import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import LoadingMsg from './../LoadingMsg';

describe('Loading', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<LoadingMsg />, div);
	});
	it('prints given name and message', () => {
		const component = shallow(<LoadingMsg name='NAME' message='MESSAGE'/>);

		expect(component.containsMatchingElement(<h1>Loading</h1>)).toBeTruthy();
		expect(component.containsMatchingElement(<h2>NAME</h2>)).toBeTruthy();
		expect(component.containsMatchingElement(<p>MESSAGE</p>)).toBeTruthy();
	});
});
