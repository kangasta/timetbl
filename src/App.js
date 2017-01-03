import React, { Component } from 'react';
import './App.css';
import ErrorMsg from './ErrorMsg.js';
import LoadingMsg from './LoadingMsg.js';
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
			return (
				<div className='app'>
					<ErrorMsg name={this.state.error.name} message={this.state.error.msg}/>
				</div>
			);
		}
		// TODO remove 1 ||
		if ((!this.state.hasOwnProperty('lat') || !this.state.hasOwnProperty('lon')) && !this.state.hasOwnProperty('stopCode')) {
			return (
				<div className='app'>
					<LoadingMsg name='User location' message={UserLocation.waitingForUserLocation}/>
				</div>
			);
		}
		//return <TimeTable lat={this.state.lat} lon={this.state.lon} maxDistance={1000} />;
		return (
			<div className='app'>
				<TimeTable stopCode='E2036' />
			</div>
		);
	}
}

export default App;
