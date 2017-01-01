import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import Loading from './Loading';

describe('Loading', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<Loading />, div);
	});
	it('prints given name and message', () => {
		const component = shallow(<Loading name='NAME' message='MESSAGE'/>);

		expect(component.containsMatchingElement(<h2>NAME</h2>)).toEqual(true);
		expect(component.containsMatchingElement(<p>MESSAGE</p>)).toEqual(true);
	});
});
