import React, { Component } from 'react';
import './App.css';
import { getNearestDepartures } from './APIQuery.js'

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data : {}
		};
	}

	componentDidMount() {
		var self = this;
		getNearestDepartures()
		.then((responseJson) => {self.setState({
			data: responseJson
		})});
	}

	render() {
		return <p>{JSON.stringify(this.state.data)}</p>;
	}
}

export default App;
