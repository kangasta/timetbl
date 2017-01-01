import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import Error from './../Error';

describe('Error', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Error />, div);
	});
	it('prints given name and message', () => {
		const component = shallow(<Error name='NAME' message='MESSAGE'/>);

		expect(component.containsMatchingElement(<h1>Error:</h1>)).toBeTruthy();
		expect(component.containsMatchingElement(<h2>NAME</h2>)).toBeTruthy();
		expect(component.containsMatchingElement(<p>MESSAGE</p>)).toBeTruthy();
	});
});
