import React, { Component } from 'react';
import './App.css';
import Error from './Error.js';
import Loading from './Loading.js';
import TimeTable from './TimeTable.js';
import UserLocation from './UserLocation.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		var self = this;
		try {
			UserLocation.getUserLocation((loc) => {
				//console.log('Got coordinates: ' + loc.coords.latitude + ',' + loc.coords.longitude);
				self.setState({
					lat:loc.coords.latitude, lon:loc.coords.longitude
				});
			}, (e) => { throw e; });
		} catch (e) {
			this.setState({error: {
				name: 'User location not available.',
				message: e.toString()
			}});
		}
	}

	render() {
		if (this.state.hasOwnProperty('error')) {
			return <Error name={this.state.error.name} message={this.state.error.msg}/>;
		}
		if (!this.state.hasOwnProperty('lat') || !this.state.hasOwnProperty('lat')) {
			return <Loading />;
		}
		return <TimeTable lat={this.state.lat} lon={this.state.lon} maxDistance={1000} />;
	}
}

export default App;
