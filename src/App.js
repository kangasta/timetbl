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
				//lat:60.183692, lon:24.827744
				lat:60.186269 ,lon:24.830909, maxDistance:1000, filterOut:'Otaniemi'
			});
		} else if (/kara/.exec(currentURL)) {
			self.setState({
				lat:[60.224655, 60.215923],
				lon:[24.759257, 24.753498],
				maxDistance:[300, 100]
			});
		} else if (/sello/.exec(currentURL)) {
			self.setState({
				lat:60.219378, lon:24.815121, maxDistance:325, filterOut:'Leppävaara'
			});
		} else if (/keskusta/.exec(currentURL)) {
			self.setState({
				lat:60.170508, lon:24.941104, maxDistance:300, filterOut:'Leppävaara'
			});
		} else if (/kamppi/.exec(currentURL)) {
			self.setState({
				lat:60.169038, lon:24.932908, maxDistance:100, filterOut:'Leppävaara'
			});
		}
		//if (/location/.exec(currentURL)) {
		else {
			UserLocation.getUserLocation((loc) => {
				self.setState({
					lat:loc.coords.latitude, lon:loc.coords.longitude, maxDistance:500
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
		//console.log('render: ' + String(this.state.lat) + ', ' + String(this.state.lon) + ', ' + String(this.state.maxDistance))
		return (
			<div className='app'>
				<div className='foreground'>
					<TimeTable lat={this.state.lat} lon={this.state.lon} maxDistance={this.state.maxDistance} maxResults={15} filterOut={this.state.filterOut}/>
				</div>
				<div className='background'>
					<MapView
						lat={Array.isArray(this.state.lat) ? this.state.lat[0] : this.state.lat}
						lon={Array.isArray(this.state.lon) ? this.state.lon[0] : this.state.lon}
					/>
				</div>
			</div>
		);
	}
}

export default App;
