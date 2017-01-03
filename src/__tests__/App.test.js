import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import App from './../App';
import ErrorMsg from './../ErrorMsg';
import LoadingMsg from './../LoadingMsg';

describe('App', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<App />, div);
	});
	it('shows loading component before first state update', () => {
		const component = shallow(<App lat={16.5} />);
		expect(component.find(LoadingMsg)).toHaveLength(1);
	});
	it('shows error when state is updated to error', () => {
		const component = shallow(<App lat={16.5} />);

		component.setState(
			{error: {
				name: 'TEST ERROR NAME',
				message: 'TEST ERROR MESSAGE'
			}}
		);
		expect(component.find(ErrorMsg)).toHaveLength(1);
	});
});
