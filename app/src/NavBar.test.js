import React from 'react';
import { mount } from 'enzyme';
import NavBar from './NavBar';

describe('NavBar', () => {
	it('renders without crashing', () => {
		mount(<NavBar />);
	});
});
