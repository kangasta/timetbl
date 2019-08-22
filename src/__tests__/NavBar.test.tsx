import React from 'react';
import { mount, shallow} from 'enzyme';
import { NavBar } from '../Components';

describe('NavBar', () => {
	it('renders without crashing', () => {
		mount(<NavBar />);
	});
	it('allows omitting className, disabled, and onClick', () => {
		const onClick = jest.fn();
		const wrapper = shallow(<NavBar buttons={[
			{text: 'a', onClick: onClick}
		]}/>);

		expect(wrapper.find('.Link').text()).toEqual('a');

		wrapper.find('.Link').simulate('click');
		expect(onClick).toHaveBeenCalledTimes(1);
	});
	it('maps provided buttons to navbar and disables onClick when component is disabled', () => {
		const onClick = jest.fn();
		const buttons = [
			{className: 'A', text: 'a', disabled: true, onClick: onClick},
			{className: 'B', text: 'b', disabled: false, onClick: onClick},
		];
		const wrapper = shallow(<NavBar buttons={buttons}/>);

		buttons.forEach(button => {
			const buttonWrapper = wrapper.find('.Link.' + button.className);

			expect(buttonWrapper.exists(button.disabled ? '.Disabled' : '.Active')).toBe(true);
			expect(buttonWrapper.text()).toEqual(button.text);
			buttonWrapper.simulate('click');
		});

		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
