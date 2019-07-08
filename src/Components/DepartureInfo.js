import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Utils from './Utils';

import '../Style/DepartureInfo.css';

class DepartureInfo extends Component {
	constructor(props) {
		super(props);

		this.state = {alerts_expanded: false};

		this.toggleAlert = this.toggleAlert.bind(this);
	}

	static currentTimeInMinutes() {
		var curTime = new Date();
		return curTime.getHours()*60 + curTime.getMinutes();
	}

	static parseHour(seconds, max23=true) {
		var h = (~~(seconds/3600));
		h = h > 23 && max23 ? h - 24 : h;
		return h;
	}

	static parseMinute(seconds, max23=true) {
		var min = (~~(seconds/60));
		min = min > 24*60 && max23 ? min - 24*60 : min;
		return min;
	}

	static parseTime(seconds, delim = ':') {
		var h = this.parseHour(seconds);

		var hStr = h.toString();
		hStr = hStr.length < 2 ? ' ' + hStr : hStr;
		var minStr = (~~((seconds%3600)/60)).toString();
		minStr = minStr.length < 2 ? '0' + minStr : minStr;

		return hStr + delim + minStr;
	}

	static departureTimeToStr(seconds) {
		if (seconds === 0) {
			return 'Time';
		}

		var departureInMinutes = DepartureInfo.parseMinute(seconds) - DepartureInfo.currentTimeInMinutes();
		departureInMinutes = departureInMinutes > 10 || departureInMinutes < 0 ? (DepartureInfo.parseMinute(seconds) - DepartureInfo.currentTimeInMinutes() + 24*60) : departureInMinutes;

		return (((departureInMinutes < 10) && (departureInMinutes >= 0)) ?
			(departureInMinutes + ' min') :
			DepartureInfo.parseTime(seconds));
	}

	getRoute(type) {
		const match = this.props.stoptime[0].trip.route.shortName.match(/(M*[0-9]+)([a-zA-Z]*)/);
		const number = !match ? this.props.stoptime[0].trip.route.shortName : match[1];

		return (
			<div className='Route'>
				<span className={'Code ' + (typeof type === 'string' ? type : '')}>
					<span className='Number'>{number}</span>
					{match ? <span className='Letters'>{match[2]}</span> : null}
				</span>
			</div>
		);
	}

	get alert_symbol() { return (
		<svg className='Symbol Fill' viewBox='0 0 64 64'>
			<defs>
				<mask id="mask">
					<path d='M 32 4 l 28 56 h -56 l 28 -56' fill='white' stroke='white' strokeWidth='8' strokeLinecap='round' strokeLinejoin='round'/>
					<path d='M 32 20 v 20' stroke='black' strokeWidth='6' fill='none' strokeLinecap='round'/>
					<circle cx='32' cy='54' r='3' fill='black'/>
				</mask>
			</defs>
			<rect x='0' y='0' width='64' height='64' mask='url(#mask)'/>
		</svg>
	); }

	toggleAlert() {
		this.setState(prev => ({'alerts_expanded': !prev.alerts_expanded}));
	}

	getAlertSymbol() {
		const alerts = this.props.stoptime[0].trip.route.alerts;

		if (alerts.length === 0 || this.state.alerts_expanded) return null;
		return (
			<div className='AlertSymbol' onClick={this.toggleAlert}>
				{this.alert_symbol}
			</div>
		);
	}

	getAlertText(lang='en') {
		const alerts = this.props.stoptime[0].trip.route.alerts;
		var alert_text;
		try {
			alert_text = alerts.map(alert => alert.alertDescriptionTextTranslations.find(translation => translation.language === lang).text)[0];
		} catch(e) {
			alert_text = 'No alert description for language "' + lang + '" available.';
		}
		if (alerts.length === 0 || !this.state.alerts_expanded) return null;
		return (
			<div className='AlertText' onClick={this.toggleAlert}>
				<span className='Left'>{this.alert_symbol}</span>
				<span>{alert_text}</span>
			</div>
		);
	}

	getDestination(classes) {
		const destinations = this.props.stoptime[0].headsign.split('via');

		return (
			<div className={'Destination ' + classes}>
				{destinations.map(Utils.toDestinationItem)}
			</div>
		);
	}

	getDetails() {
		if (this.props.showPlatform) {
			const name = this.props.stoptime[0].stop.name;
			const code = this.props.stoptime[0].stop.code;
			const platform = this.props.stoptime[0].stop.platformCode;
			const show_name = this.props.showStopName;
			const distance = this.props.distance;

			return (
				<div className='Details'>
					{show_name ? Utils.toDestinationItem(name) : null}
					{show_name ? ', ' : null}
					{platform == null ? 'Stop ' + code : null}
					{platform !== null ? 'Platform ' + platform.toString() : null}
					{distance !== undefined ? <span className='Distance'>{': ' + distance.toString() + ' m'}</span> : null}
				</div>
			);
		}
		return null;
	}

	render() {
		const details = this.props.showPlatform ? 'WithDetails' : 'NoDetails';
		return (
			<li className='DepartureInfo ListItem'>
				{this.getRoute(this.props.stoptime[0].trip.route.mode)}
				<ul className='DepartureList'>
					{this.props.stoptime.map((stoptime,i)=>(
						<li key={i} className={'Departure ' + (stoptime.realtime ? 'Realtime' : 'Scheduled')}>
							{DepartureInfo.departureTimeToStr(stoptime.realtimeDeparture)}
						</li>)
					)}
				</ul>
				{this.getAlertSymbol()}
				{this.getDestination(details)}
				{this.getDetails()}
				{this.getAlertText()}
			</li>
		);
	}
}

DepartureInfo.defaultProps = {
	showPlatform: false,
	showStopName: false,
};

DepartureInfo.propTypes = {
	showPlatform: PropTypes.bool,
	showStopName: PropTypes.bool,
	distance: PropTypes.number,
	stoptime: PropTypes.arrayOf(PropTypes.shape({
		stop: PropTypes.shape({
			code: PropTypes.string,
			name: PropTypes.string,
			platformCode: PropTypes.string
		}),
		trip: PropTypes.shape({
			route: PropTypes.shape({
				shortName: PropTypes.string,
				mode: PropTypes.string,
				alerts: PropTypes.array
			})
		}),
		realtimeArrival: PropTypes.number,
		realtimeDeparture: PropTypes.number,
		realtime: PropTypes.bool,
		scheduledDeparture: PropTypes.number,
		headsign: PropTypes.string
	})),
	header: PropTypes.string,
};

export default DepartureInfo;
