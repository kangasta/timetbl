import React from 'react';
import ReactDOM from 'react-dom';
import TimeTable from './../TimeTable.js';

describe('TimeTable', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<TimeTable />, div);
	});
});