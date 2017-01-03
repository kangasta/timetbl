import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import TimeTable from './../TimeTable.js';
import ErrorMsg from './../ErrorMsg';
import LoadingMsg from './../LoadingMsg';

describe('TimeTable', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<TimeTable />, div);
	});
	it('shows error when created with invalid props.', () => {
		const component = shallow(<TimeTable lat={16.5} />);
		expect(component.find(ErrorMsg)).toHaveLength(1);
	});
	it('shows loading when created.', () => {
		const component = shallow(<TimeTable lat={16.5} lon={28.5}/>);
		expect(component.find(LoadingMsg)).toHaveLength(1);
	});
});