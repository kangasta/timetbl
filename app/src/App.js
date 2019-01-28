import React, { Component } from 'react';

import { CSExpandable, CSStatus, CSValidatorChanger } from 'chillisalmon';
import { StopMenu, TimeTable, Title } from 'timetbl';

import UserLocation from './UserLocation.js';
import NavBar from './NavBar.js';

import './App.css';
import './Theme.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = this.parseURL();
		window.history.replaceState(this.state, 'timetbl', this.state.url);
		window.onpopstate = (event) => {
			this.setState(event.state);
		};

		this.navigate = this.navigate.bind(this);
	}

	getActiveView() {
		try {
			if (this.state.view.hasOwnProperty('menu')) {
				return (
					<StopMenu lat={this.state.coords.lat} lon={this.state.coords.lon} maxDistance={this.state.coords.r} navigate={this.navigate}/>
				);
			} else if (this.state.view.hasOwnProperty('nearby')) {
				return (
					<TimeTable lat={this.state.coords.lat} lon={this.state.coords.lon} maxDistance={this.state.coords.r} maxResults={15}/>
				);
			} else if (this.state.view.hasOwnProperty('stop')) {
				return (
					<TimeTable stopCode={this.state.view.stop.code} maxResults={15}/>
				);
			} else if (this.state.view.hasOwnProperty('error')) {
				return (
					<CSStatus status={CSStatus.status.ERROR} message={this.state.view.error}/>
				);
			} else {
				return (
					<CSStatus status={CSStatus.status.ERROR} message='State can not be resolved'/>
				);
			}
		} catch(e) {
			return (
				<CSStatus status={CSStatus.status.LOADING} message='Waiting location'/>
			);
		}
	}

	getTitle() {
		if (this.state.hasOwnProperty('error')) return null;
		try {
			if (this.state.hasOwnProperty('title') && this.state.title) {
				return (
					<Title text={this.state.title} clock={true}/>
				);
			} else if (this.state.view.hasOwnProperty('menu') || this.state.view.hasOwnProperty('nearby')) {
				return (
					<Title lat={this.state.coords.lat} lon={this.state.coords.lon} clock={true}/>
				);
			} else if (this.state.view.hasOwnProperty('stop')) {
				return (
					<Title text={this.state.view.stop.code[0]} clock={true}/>
				);
			} else {
				return null;
			}
		} catch(e) {
			return null;
		}
	}

	getNavBar() {
		if (this.getTitle() === null) return null;

		const buttons = [
			{
				text: 'Nearby',
				onClick: () => {this.navigate('/#/nearby');},
				disabled: this.state.view.hasOwnProperty('nearby')
			},
			/*
			{
				text: 'Station',
				disabled: true
			},
			{
				text: 'Stop',
				disabled: true
			},
			*/
			{
				text: 'Bikes',
				disabled: true
			},
			{
				text: 'Menu',
				onClick: () => {this.navigate('/#/menu');},
				disabled: this.state.view.hasOwnProperty('menu')
			}
		];

		return (
			<CSExpandable>
				<NavBar buttons={buttons}/>
			</CSExpandable>
		);
	}

	getLazyURLSearchParamsMock(param_str) {
		return {
			get: (param_name) => {
				const match = param_str.match(param_name + '=([^&/]+)');
				if (!match) return null;
				return match[1];
			}
		};
	}

	parseURL(url=document.location.href) {
		const base = document.location.href.match(/:\/\/[^/]*(\/[^#]*)/)[1];
		const params_match = url.match(/\?.*/);
		const params_str = params_match ? params_match[0] : '';

		var url_params;
		try {
			url_params = new URLSearchParams(params_str);
		} catch(e) {
			url_params = this.getLazyURLSearchParamsMock(params_str);
		}

		var match;
		var state = {};

		if (this.state !== undefined) {
			clearInterval(this.state.follow_interval);
		}

		if (url_params.get('follow') !== 'false') {
			state = Object.assign(state, {
				follow: true
			});
		}

		state = Object.assign(state, {title: url_params.get('title')});

		const lat = Number(url_params.get('lat'));
		const lon = Number(url_params.get('lon'));

		if (lat && lon) {
			var r = Number(url_params.get('r'));
			r = isNaN(r) ? 1000 : r;

			state = Object.assign(state, {
				coords: {
					lat: lat,
					lon: lon,
					r: r
				}
			});
		}

		const view = (() => {
			/* eslint-disable no-cond-assign */
			if (match = url.match(/#\/menu.*/)) {
				return {
					'view': {
						'menu': null
					},
					'url': base + match[0]
				};
			} /* else if (match = url.match(/#\/nearby/)) {
				return {
					'view': {
						'nearby': null
					},
					'url': base + match[0]
				};
			} */ else if (match = url.match(/#\/stop(\?[^/]*)/)) {
				return {
					'view': {
						'stop': {
							'code': url_params.get('code').split(',')
						}
					},
					'url': base + match[0]
				};
			} else {
				return {
					'view': {
						'nearby': null
					},
					'url': base + '#/nearby' + params_str
				};
			}
			/* eslint-enable no-cond-assign */
		})();
		return Object.assign(state, view);
	}

	updateLocation() {
		UserLocation.getUserLocation((loc) => {
			const lat = Math.round(loc.coords.latitude*1e6)/1e6;
			const lon = Math.round(loc.coords.longitude*1e6)/1e6;
			this.setState(prev => ({
				coords: {
					lat: lat,
					lon: lon,
					r: prev.coords ? prev.coords.r : 1000
				}
			}));
		}, () => {
			this.setState({view: {error: 'Location not available'}});
		});
	}

	navigate(url) {
		this.setState(this.parseURL(url), ()=>{
			window.history.pushState(this.state, 'timetbl', this.state.url);
		});
	}

	componentDidMount() {
		if (this.state.follow) {
			this.setState({
				follow_interval: setInterval(() => {
					this.updateLocation();
				}, 30e3)
			});
			this.updateLocation();
		}
	}

	render() {
		return(
			<div className='App ThemeDefault'>
				{this.getTitle()}
				{this.getNavBar()}
				<CSValidatorChanger error={this.state.view.error} loading={this.state.view.loading}>
					{this.getActiveView()}
				</CSValidatorChanger>
				<div className='Whitespace'/>
				<div className='Background'/>
				<div className='Footer'>
					<a className='Link' href='https://github.com/kangasta/timetbl'>kangasta / timetbl</a>
					<span className='Divider'>|</span>
					<a className='Link' href='https://digitransit.fi/en/developers/'>data source</a>
				</div>
			</div>
		);
	}
}

export default App;
