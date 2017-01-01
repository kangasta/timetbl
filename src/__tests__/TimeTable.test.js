import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import TimeTable from './../TimeTable.js';
import Error from './../Error';
import Loading from './../Loading';

describe('TimeTable', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<TimeTable />, div);
	});
	it('shows error when created with invalid props.', () => {
		const component = shallow(<TimeTable lat={16.5} />);
		expect(component.find(Error)).toHaveLength(1);
	});
	it('shows loading when created.', () => {
		const component = shallow(<TimeTable lat={16.5} lon={28.5}/>);
		expect(component.find(Loading)).toHaveLength(1);
	});
});