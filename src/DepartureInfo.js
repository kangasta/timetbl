import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../style/DepartureInfo.css';

class DepartureInfo extends Component {
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

	render() {
		const details = this.props.stop !== undefined ? 'WithDetails' : 'NoDetails';
		return (
			<li className='DepartureInfo ListItem'>
				<div className='Route'>{this.props.stoptime[0].trip.route.shortName}</div>
				<ul className='DepartureList'>
					{this.props.stoptime.map((stoptime,i)=>(
						<li key={i} className={'Departure ' + (stoptime.realtime ? 'Realtime' : '')}>
							{DepartureInfo.departureTimeToStr(stoptime.realtimeDeparture)}
						</li>)
					)}
				</ul>
				<div className={'Destination ' + details}>{this.props.stoptime[0].headsign}</div>
				<div className='Details'>
					{this.props.stop !== undefined ? <b className='StopName'>{this.props.stop.name}</b> : null}
					{this.props.distance !== undefined ? <span className='Distance'>{': ' + this.props.distance.toString() + ' m'}</span> : null}
				</div>
			</li>
		);
	}
}

DepartureInfo.propTypes = {
	distance: PropTypes.number,
	stop: PropTypes.shape({
		name: PropTypes.string,
		code: PropTypes.string,
		platformCode: PropTypes.string,
		desc: PropTypes.string,
		lat: PropTypes.number,
		lon: PropTypes.number
	}),
	stoptime: PropTypes.arrayOf(PropTypes.shape({
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
	row: PropTypes.number
};

export default DepartureInfo;
