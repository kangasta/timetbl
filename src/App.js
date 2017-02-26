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

		var currentURL = window.location.href;


		if (/niemi/.exec(currentURL)) {
			self.setState({
				lat:60.183692, lon:24.827744
			});
		} else if (/kara/.exec(currentURL)) {
			self.setState({
				lat:60.224655, lon:24.759257
			});
		}
		//if (/location/.exec(currentURL)) {
		else {
			UserLocation.getUserLocation((loc) => {
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
					<TimeTable lat={this.state.lat} lon={this.state.lon} maxDistance={2000} maxResults={15}/>
				</div>
				<div className='background'>
					<MapView lat={this.state.lat} lon={this.state.lon}/>
				</div>
			</div>
		);
	}
}

export default App;
