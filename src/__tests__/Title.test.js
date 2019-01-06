import React from 'react';
import { mount } from 'enzyme';
import Title from './../Title';

describe('Title', () => {
	it('renders without crashing', () => {
		mount(<Title />);
	});
});
