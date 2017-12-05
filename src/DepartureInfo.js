import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './DepartureInfo.css';

class DepartureInfo extends Component {
	render() {
		var departureType = ((this.props.stop.name === 'Stop name' && this.props.header.toLowerCase() !== 'nearest') || this.props.header.toLowerCase() === 'stop') ? 'stop-type' : 'nearest-type';
		var hideStopInfo = departureType === 'stop-type' ? 'hide' : '';
		var rowClass = (this.props.row % 2) ? 'odd' : 'even';
		rowClass = this.props.header ? 'header' : rowClass;
		var realtime = this.props.stoptime.realtime ? 'realtime' : '';
		var routeType = 'route-type-' + this.props.stoptime.trip.route.mode.toLowerCase();
		return (
			<div className={'departure ' + rowClass + ' ' + departureType}>
				<ul>
					<li className={'stop name ' + hideStopInfo}> {this.props.stop.name} </li>
					<li className={'route number ' + routeType + ' ' + departureType}> {this.props.stoptime.trip.route.shortName} </li>
					<li className={'route destination ' + departureType}> {this.props.stoptime.stopHeadsign} </li>
					<li className={'route deptime ' + realtime}> {DepartureInfo.departureTimeToStr(this.props.stoptime.realtimeDeparture)}</li>
				</ul>
			</div>
		);
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
}

DepartureInfo.defaultProps = {
	stop: {
		name: 'Stop name',
		code: 'Stop code',
		platformCode: 'Platform',
		desc: 'Stop description',
		lat: 47.916667,
		lon: 106.916667
	},
	stoptime: {
		trip: {
			route: {
				shortName: 'Route',
				mode: 'Type',
				alerts: []
			}
		},
		realtimeArrival: 0,
		realtimeDeparture: 0,
		realtime: false,
		stopHeadsign: 'Destination'
	},
	header: '',
	row: 0
};

DepartureInfo.propTypes = {
	stop: PropTypes.shape({
		name: PropTypes.string,
		code: PropTypes.string,
		platformCode: PropTypes.string,
		desc: PropTypes.string,
		lat: PropTypes.number,
		lon: PropTypes.number
	}),
	stoptime: PropTypes.shape({
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
		stopHeadsign: PropTypes.string
	}),
	header: PropTypes.string,
	row: PropTypes.number
};

export default DepartureInfo;
