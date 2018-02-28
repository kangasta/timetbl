import React from 'react';
import { mount, shallow } from 'enzyme';
import TimeTable from './../TimeTable.js';
import DepartureInfo from './../DepartureInfo.js';

jest.mock('../APIQuery');
jest.useFakeTimers();

describe('TimeTable', () => {
	afterEach(()=>{
		jest.resetAllMocks();
	});

	it('renders without crashing', () => {
		mount(<TimeTable />);
	});
	it('shows error when created with invalid props.', () => {
		const component = mount(<TimeTable lat={16.5} />);
		expect(component.find('.cs-error')).toHaveLength(1);
	});
	it('shows loading when created.', () => {
		const component = mount(<TimeTable lat={16.5} lon={28.5}/>);
		expect(component.find('.cs-loading')).toHaveLength(1);
	});
	it('shows nearest departure infos after succesfull API query.', () => {
		const lat = [16.5, [16.5, 14.5]];
		const lon = [16.5, [28.5, 26.5]];
		for(var i = 0; i < lat.length; i++) {
			const component = shallow(<TimeTable lat={lat[i]} lon={lon[i]}  filterOut={'Otaniemi'}/>);
			component.instance().sendQuery();
			const update = component.componentDidUpdate;
			component.componentDidUpdate = () => {
				expect(component.find('.cs-loading')).toHaveLength(0);
				expect(component.find(DepartureInfo)).not.toHaveLength(0);
				if (update) update();
			};
		}
	});
	it('shows stop departure infos after succesfull API query.', () => {
		const component = shallow(<TimeTable stopCode='E2036'/>);
		component.instance().sendQuery();
		const update = component.componentDidUpdate;
		component.componentDidUpdate = () => {
			expect(component.find('.cs-loading')).toHaveLength(0);
			expect(component.find(DepartureInfo)).not.toHaveLength(0);
			if (update) update();
		};
	});
	it('shows error after failed API query.', () =>  {
		const component = shallow(<TimeTable stopCode='666'/>);
		component.instance().sendQuery();
		const update = component.componentDidUpdate;
		component.componentDidUpdate = () => {
			expect(component.find('.cs-error')).toHaveLength(1);
			if (update) update();
		};
	});
	it('sends queries periodically', ()=> {
		const spy = jest.spyOn(TimeTable.prototype, 'sendQuery');
		shallow(<TimeTable stopCode='666'/>);
		jest.runTimersToTime(10e3);
		expect(spy).toHaveBeenCalledTimes(2);
	});
	it('clears timers at unmount', () => {
		const wrapper = mount(
			<TimeTable />
		);
		wrapper.unmount();
		expect(clearInterval).toHaveBeenCalled();
	});
});