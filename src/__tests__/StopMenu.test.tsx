import React from 'react';
import { mount } from 'enzyme';

import { StopMenu } from '../Components/StopMenu';

//jest.mock('../APIQuery');

describe('StopMenu', () => {
	it('renders without crashing', () => {
		mount(<StopMenu type='nearestStops' data={[]} navigate={() => ({type: 'NAVIGATE'})}/>);
	});
});
