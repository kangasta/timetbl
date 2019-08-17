import React from 'react';
import { mount, shallow } from 'enzyme';
import { DepartureInfo, TimeTable} from '../timetbl';

jest.mock('../APIQuery');

const checkForDepartureInfo = (component, callback) => {
	expect(component.find('.Loading')).toHaveLength(0);
	expect(component.find(DepartureInfo)).not.toHaveLength(0);
	if (callback) callback();
};

describe('TimeTable', () => {
	it('renders without crashing', () => {
		mount(<TimeTable />);
	});
	it('shows error when created with invalid props.', () => {
		const component = mount(<TimeTable lat={16.5} />);
		expect(component.exists('.cs-changer-item-active .Error')).toBe(true);
	});
	it('shows loading when created.', () => {
		const component = mount(<TimeTable lat={16.5} lon={28.5}/>);
		expect(component.exists('.cs-changer-item-active .Loading')).toBe(true);
	});
	it('shows nearest departure infos after succesfull API query.', () => {
		const lat = [16.5, [16.5, 14.5]];
		const lon = [16.5, [28.5, 26.5]];
		for(let i = 0; i < lat.length; i++) {
			const component = shallow(<TimeTable lat={lat[i]} lon={lon[i]}  filterOut={'Otaniemi'}/>);
			component.instance().sendQuery();
			const update = component.componentDidUpdate;
			component.componentDidUpdate = () => {
				checkForDepartureInfo(component, update);
			};
		}
	});
	it('shows stop departure infos after succesfull API query.', () => {
		const component = shallow(<TimeTable stopCode='E2036'/>);
		component.instance().sendQuery();
		const update = component.componentDidUpdate;
		component.componentDidUpdate = () => {
			checkForDepartureInfo(component, update);
		};
	});
	it('shows error after failed API query.', () =>  {
		const component = shallow(<TimeTable stopCode='666'/>);
		component.instance().sendQuery();
		const update = component.componentDidUpdate;
		component.componentDidUpdate = () => {
			expect(component.find('.Error')).toHaveLength(1);
			if (update) update();
		};
	});
	/*
	it('sends queries periodically', ()=> {
		const spy = jest.spyOn(TimeTable.prototype, 'sendQuery');
		shallow(<TimeTable stopCode='E1234'/>);
		jest.runTimersToTime(10e3);
		expect(spy).toHaveBeenCalledTimes(2);
	});
	*/
	it('clears timers at unmount', () => {
		const wrapper = mount(
			<TimeTable />
		);
		wrapper.unmount();
		expect(clearInterval).toHaveBeenCalled();
	});
});