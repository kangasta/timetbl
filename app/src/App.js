import React, { Component } from 'react';

import { CSBackground, CSCentered, CSTitle, CSValidatorChanger, CSWhiteSpace } from 'chillisalmon';
import TimeTable from 'timetablescreen';
import UserLocation from './UserLocation.js';

import './App.css';
import './Theme.css';

class App extends Component {
	name = 'timetablescreen';

	constructor(props) {
		super(props);

		this.state = this.parseURL();
		window.history.replaceState(this.state, this.name, this.state.url);
		window.onpopstate = (event) => {
			this.setState(event.state);
		};

		this.navigate = this.navigate.bind(this);
	}

	getActiveView() {
		if (this.state.view.hasOwnProperty('mainmenu')) {
			return (
				"Mainmenu: TODO"
			);
		} else if (this.state.view.hasOwnProperty('nearby')) {
			return (
				<TimeTable lat={this.state.view.nearby.lat} lon={this.state.view.nearby.lon} maxDistance={this.state.view.nearby.r} maxResults={15}/>
			);
		} else if (this.state.view.hasOwnProperty('stop')) {
			return (
				<TimeTable stopCode={this.state.view.stop.code} maxResults={15}/>
			);
		} else {
			this.navigateWithLocation('/#/nearby');
			return (
				"Waiting location: TODO"
			);
		}
	}

	parseURL(url=document.location.href) {
		var match;
		/* eslint-disable no-cond-assign */
		if (match = url.match(/#\/menu\/([^/]*)/)) {
			return {
				'view': {
					'menu': match[1]
				},
				'url': match[0]
			};
		} else if (match = url.match(/#\/nearby(\?[^/]*)/)) {
			const url_params = new URLSearchParams(match[1]);
			return {
				'view': {
					'nearby': {
						'lat': Number(url_params.get('lat')),
						'lon': Number(url_params.get('lon')),
						'r': url_params.get('r') ? url_params.get('r') : 499
					}
				},
				'url': match[0]
			};
		} else if (match = url.match(/#\/stop(\?[^/]*)/)) {
			const url_params = new URLSearchParams(match[1]);
			return {
				'view': {
					'stop': {
						'code': url_params.get('code').split(',')
					}
				},
				'url': match[0]
			};
		} else {
			return {
				'view': {
					'topics': null
				},
				'url': '/#/'
			};
		}
		/* eslint-enable no-cond-assign */
	}

	navigateWithLocation(url) {
		UserLocation.getUserLocation((loc) => {
			const lat = (Math.round(loc.coords.latitude*1e6)/1e6).toString();
			const lon = (Math.round(loc.coords.longitude*1e6)/1e6).toString();
			this.navigate(url + '?lat=' + lat + "&lon=" + lon);
		}, (error) => {
			throw Error(error.toString());
		});
}

	navigate(url) {
		this.setState(this.parseURL(url), ()=>{
			window.history.pushState(this.state, this.name, this.state.url);
		});
	}

	render() {
		return(
			<div className='app app-theme-default'>
				<CSCentered>
					<CSTitle className='timetable-title'>Nearest departures</CSTitle>
					<CSValidatorChanger error={this.state.view.error} loading={this.state.view.loading}>
						{this.getActiveView()}
					</CSValidatorChanger>
					<CSWhiteSpace/>
				</CSCentered>
				<CSBackground className='app-bg'/>
			</div>
		);
	}
}

export default App;
