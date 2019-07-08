import React from 'react';
import { mount } from 'enzyme';

import { StopMenu } from '../timetbl';

jest.mock('../APIQuery');

describe('StopMenu', () => {
	it('renders without crashing', () => {
		mount(<StopMenu />);
	});
});
