import React, { Component } from 'react';
import './App.css';
import TimeTable from './TimeTable.js'

class App extends Component {
	render() {
		//return <TimeTable />;
		//return <TimeTable stopCode="E2036" />;
		return <TimeTable lat={60.1836474999998} lon={24.828072999999993} />;
	}
}

export default App;
