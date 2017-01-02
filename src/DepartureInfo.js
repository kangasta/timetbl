import React, { Component } from 'react';
import './DepartureInfo.css';

class DepartureInfo extends Component {
	render() {
		var departureType = ((this.props.stop.name === 'Stop name' && this.props.header.toLowerCase() !== 'nearest') || this.props.header.toLowerCase() === 'stop') ? 'stop-type' : 'nearest-type';
		var hideStopInfo = departureType === 'stop' ? 'hide' : '';
		var rowClass = (this.props.row % 2) ? 'odd' : 'even';
		rowClass = this.props.header ? 'header' : rowClass;
		return (
			<div className={'departure ' + rowClass + ' ' + departureType}>
				<ul>
					<li className='route type'> {this.props.stoptime.trip.route.mode} </li>
					<li className={'stop code ' + hideStopInfo}> {this.props.stop.code} </li>
					<li className={'stop name ' + hideStopInfo}> {this.props.stop.name} </li>
					<li className={'stop platform ' + hideStopInfo}> {this.props.stop.platformCode ? this.props.stop.platformCode : '1'} </li>
					<li className={'route number ' + departureType}> {this.props.stoptime.trip.route.shortName} </li>
					<li className={'route destination ' + departureType}> {this.props.stoptime.stopHeadsign} </li>
					<li className='route deptime'> {DepartureInfo.departureTimeToStr(this.props.stoptime.realtimeArrival, this.props.stoptime.realtime)}</li>
				</ul>
			</div>
		); // TODO bug with empty platform field should be fixed in css.
	}

	static currentTimeInMinutes() {
		var curTime = new Date();
		return curTime.getHours()*60 + curTime.getMinutes();
	}

	static parseHour(seconds) {
		var h = (~~(seconds/3600));
		h = h > 23 ? h - 24 : h;
		return h;
	}

	static parseTime(seconds, delim = ':') {
		var h = this.parseHour(seconds);

		var hStr = h.toString();
		hStr = hStr.length < 2 ? ' ' + hStr : hStr;
		var minStr = (~~((seconds%3600)/60)).toString();
		minStr = minStr.length < 2 ? '0' + minStr : minStr;

		return hStr + delim + minStr;
	}

	static departureTimeToStr(seconds, isRealTime = false) {
		if (seconds === 0) {
			return 'Time';
		}

		var departureInMinutes =  DepartureInfo.parseHour(seconds)*60 + (~~((seconds%3600)/60)) - DepartureInfo.currentTimeInMinutes();

		return (isRealTime ? ' ' : '~') + (((departureInMinutes < 10) && (departureInMinutes >= 0)) ?
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
				shortName: 'Route number',
				mode: 'Route type',
				alerts: []
			}
		},
		realtimeArrival: 0,
		realtimeDeparture: 0,
		realtime: true,
		stopHeadsign: 'Destination'
	},
	header: '',
	row: 0
};

DepartureInfo.propTypes = {
	stop: React.PropTypes.shape({
		name: React.PropTypes.string,
		code: React.PropTypes.string,
		platformCode: React.PropTypes.string,
		desc: React.PropTypes.string,
		lat: React.PropTypes.number,
		lon: React.PropTypes.number
	}),
	stoptime: React.PropTypes.shape({
		trip: React.PropTypes.shape({
			route: React.PropTypes.shape({
				shortName: React.PropTypes.string,
				mode: React.PropTypes.string,
				alerts: React.PropTypes.array
			})
		}),
		realtimeArrival: React.PropTypes.number,
		realtimeDeparture: React.PropTypes.number,
		realtime: React.PropTypes.bool,
		stopHeadsign: React.PropTypes.string
	}),
	header: React.PropTypes.string,
	row: React.PropTypes.number
};

export default DepartureInfo;
