import React, { Component } from 'react';
import './App.css';
import ErrorMsg from './ErrorMsg.js';
import LoadingMsg from './LoadingMsg.js';
import TimeTable from './TimeTable.js';
import UserLocation from './UserLocation.js';
//import MapView from './MapView.js';

import { SFMainFeed } from './simple-feed/src/SF';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		var self = this;

		var currentURL = window.location.href;


		if (/kamppi/.exec(currentURL)) {
			self.setState({
				lat:60.169038, lon:24.932908, maxDistance:100, filterOut:'Leppävaara'
			});
		}
		else if (/kara/.exec(currentURL)) {
			self.setState({
				lat:[60.224655, 60.215923],
				lon:[24.759257, 24.753498],
				maxDistance:[300, 100]
			});
		} else if (/keskusta/.exec(currentURL)) {
			self.setState({
				lat:60.170508,
				lon:24.941104,
				maxDistance:300,
			});
		} else if (/mattby/.exec(currentURL)) {
			self.setState({
				lat:60.161874,
				lon:24.739518,
				maxDistance:1000,
				filterOut:'Matinkylä'
			});
		} else if (/niemi/.exec(currentURL)) {
			self.setState({
				lat:60.186269,
				lon:24.830909,
				maxDistance:1000,
				filterOut:'Otaniemi'
			});
		} else if (/sello/.exec(currentURL)) {
			self.setState({
				lat:60.219378,
				lon:24.815121,
				maxDistance:325,
				filterOut:'Leppävaara'
			});
		} else if (/niittari/.exec(currentURL)) {
			self.setState({
				lat:[60.170882,60.167753],
				lon:[24.760174,24.771770],
				maxDistance:[300,150],
			});
		} else  {
			UserLocation.getUserLocation((loc) => {
				self.setState({
					lat:Math.round(loc.coords.latitude*1e6)/1e6,
					lon:Math.round(loc.coords.longitude*1e6)/1e6,
					maxDistance:499
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
		return(
			<SFMainFeed>
				<TimeTable lat={this.state.lat} lon={this.state.lon} maxDistance={this.state.maxDistance} maxResults={15} filterOut={this.state.filterOut}/>
			</SFMainFeed>
		);
		/*if (this.state.hasOwnProperty('error')) {
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
		*/
	}
}

export default App;
