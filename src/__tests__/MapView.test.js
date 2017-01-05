import React from 'react';
import ReactDOM from 'react-dom';
//import { shallow } from 'enzyme';
import MapView from './../MapView';

describe('MapView', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<MapView />, div);
	});
});