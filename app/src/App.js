import React, { Component } from 'react';

import { CSBackground, CSError, CSLoading, CSValidatorChanger, CSWhiteSpace } from 'chillisalmon';
import { StopMenu, TimeTable, Title } from 'timetablescreen';
import UserLocation from './UserLocation.js';

import './App.css';
import './Theme.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = this.parseURL();
		window.history.replaceState(this.state, 'timetablescreen', this.state.url);
		window.onpopstate = (event) => {
			this.setState(event.state);
		};

		this.navigate = this.navigate.bind(this);
	}

	getActiveView() {
		if (this.state.view.hasOwnProperty('menu')) {
			return (
				<StopMenu lat={this.state.view.menu.lat} lon={this.state.view.menu.lon} maxDistance={this.state.view.menu.r} navigate={this.navigate}/>
			);
		} else if (this.state.view.hasOwnProperty('nearby')) {
			return (
				<TimeTable lat={this.state.view.nearby.lat} lon={this.state.view.nearby.lon} maxDistance={this.state.view.nearby.r} maxResults={15}/>
			);
		} else if (this.state.view.hasOwnProperty('stop')) {
			return (
				<TimeTable stopCode={this.state.view.stop.code} maxResults={15}/>
			);
		} else if (this.state.view.hasOwnProperty('error')) {
			return (
				<CSError>{this.state.view.error}</CSError>
			);
		} else {
			return (
				<CSLoading>Waiting location</CSLoading>
			);
		}
	}

	getTitle() {
		if (this.state.hasOwnProperty('title')) {
			return (
				<Title text={this.state.title}/>
			);
		}
		if (this.state.view.hasOwnProperty('menu')) {
			return (
				<Title lat={this.state.view.menu.lat} lon={this.state.view.menu.lon}/>
			);
		} else if (this.state.view.hasOwnProperty('nearby')) {
			return (
				<Title lat={this.state.view.nearby.lat} lon={this.state.view.nearby.lon}/>
			);
		} else if (this.state.view.hasOwnProperty('stop')) {
			return (
				<Title text={this.state.view.stop.code[0]}/>
			);
		} else {
			return null;
		}
	}

	parseURL(url=document.location.href) {
		const base = document.location.href.match(/:\/\/[^/]*(\/[^#]*)/)[1];
		var match;

		const params_to_title = params_str => {
			const url_params = new URLSearchParams(params_str);
			return url_params.get('title');
		};

		const params_to_loc = params_str => {
			const url_params = new URLSearchParams(params_str);
			return {
				'lat': Number(url_params.get('lat')),
				'lon': Number(url_params.get('lon')),
				'r': url_params.get('r') ? url_params.get('r') : 499
			};
		};

		/* eslint-disable no-cond-assign */
		if (match = url.match(/#\/menu(\?[^/]*)/)) {
			return {
				'view': {
					'menu': params_to_loc(match[1])
				},
				'url': base + match[0]
			};
		} else if (match = url.match(/#\/nearby(\?[^/]*)/)) {
			return {
				'view': {
					'nearby': params_to_loc(match[1])
				},
				'title': params_to_title(match[1]),
				'url': base + match[0]
			};
		} else if (match = url.match(/#\/nearby/)) {
			return {
				'view': {
					'initial': '/#/nearby'
				},
				'title': params_to_title(match[1]),
				'url': base + match[0]
			};
		} else if (match = url.match(/#\/stop(\?[^/]*)/)) {
			const url_params = new URLSearchParams(match[1]);
			return {
				'view': {
					'stop': {
						'code': url_params.get('code').split(',')
					}
				},
				'title': params_to_title(match[1]),
				'url': base + match[0]
			};
		} else {
			return {
				'view': {
					'initial': '/#/menu'
				},
				'url': base + '#/'
			};
		}
		/* eslint-enable no-cond-assign */
	}

	navigateWithLocation(url) {
		UserLocation.getUserLocation((loc) => {
			const lat = (Math.round(loc.coords.latitude*1e6)/1e6).toString();
			const lon = (Math.round(loc.coords.longitude*1e6)/1e6).toString();
			this.navigate(url + '?lat=' + lat + '&lon=' + lon);
		}, () => {
			this.setState({view: {error: 'Location not available'}});
		});
	}

	navigate(url) {
		this.setState(this.parseURL(url), ()=>{
			window.history.pushState(this.state, 'timetablescreen', this.state.url);
		});
	}

	componentWillMount() {
		if (this.state.view.hasOwnProperty('initial')) {
			try {
				this.navigateWithLocation(this.state.view.initial);
			} catch (e) {
				this.setState({view: {error: 'Location not available'}});
			}
		}
	}

	render() {
		return(
			<div className='app app-theme-default'>
				{this.getTitle()}
				<CSValidatorChanger error={this.state.view.error} loading={this.state.view.loading}>
					{this.getActiveView()}
				</CSValidatorChanger>
				<CSWhiteSpace/>
				<CSBackground className='app-bg'/>
			</div>
		);
	}
}

export default App;
