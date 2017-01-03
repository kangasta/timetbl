import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import TimeTable from './../TimeTable.js';
import ErrorMsg from './../ErrorMsg';
import LoadingMsg from './../LoadingMsg';
import DepartureInfo from './../DepartureInfo.js';

jest.mock('../APIQuery');

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
	it('shows nearest departure infos after succesfull API query.', async () => {
		const component = shallow(<TimeTable lat={16.5} lon={28.5}/>);
		await component.instance().sendQuery();
		component.update();
		expect(component.find(LoadingMsg)).toHaveLength(0);
		expect(component.find(DepartureInfo)).not.toHaveLength(0);
	});
	it('shows stop departure infos after succesfull API query.', async () => {
		const component = shallow(<TimeTable stopCode='E2036'/>);
		await component.instance().sendQuery();
		component.update();
		expect(component.find(LoadingMsg)).toHaveLength(0);
		expect(component.find(DepartureInfo)).not.toHaveLength(0);
	});
});