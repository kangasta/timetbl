import React, { Component } from 'react';
import './App.css';
import ErrorMsg from './ErrorMsg.js';
import LoadingMsg from './LoadingMsg.js';
import TimeTable from './TimeTable.js';
import UserLocation from './UserLocation.js';
import MapView from './MapView.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		var self = this;
		UserLocation.getUserLocation((loc) => {
			//console.log('Got coordinates: ' + loc.coords.latitude + ',' + loc.coords.longitude);
			self.setState({
				lat:loc.coords.latitude, lon:loc.coords.longitude
			});
		}, (e) => {
			this.setState({error: {
				name: 'User location not available.',
				message: e.toString()
			}});
		});
	}

	render() {
		if (this.state.hasOwnProperty('error')) {
			return (
				<div className='app'>
					<ErrorMsg name={this.state.error.name} message={this.state.error.message}/>
				</div>
			);
		}
		if ((!this.state.hasOwnProperty('lat') || !this.state.hasOwnProperty('lon')) && !this.state.hasOwnProperty('stopCode')) {
			return (
				<div className='app'>
					<LoadingMsg name='User location' message={UserLocation.waitingForUserLocation}/>
				</div>
			);
		}
		//<TimeTable stopCode='E2036' />;
		//Alvarin aukio 60.186269, 24.830909
		return (
			<div className='app'>
				<div className='foreground'>
					<TimeTable lat={this.state.lat} lon={this.state.lon} maxDistance={1000} maxResults={30}/>
				</div>
				<div className='background'>
					<MapView lat={this.state.lat} lon={this.state.lon} maxDistance={1000} maxResults={30}/>
				</div>
			</div>
		);
	}
}

export default App;
