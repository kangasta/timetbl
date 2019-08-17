import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSValidatorChanger } from 'chillisalmon';

import { DepartureInfo } from '../timetbl';
import { sendQuery } from '../ApiUtils.ts';

import '../Style/TimeTable.css';

class TimeTable extends Component {
	constructor(props) {
		super(props);
		let data = {loading: 'Waiting for timetable data from HSL API.'};
		if (this.getType() === 'none') {
			data = {error: 'Unsupported timetable type'};
		}
		this.state = {
			data: data
		};
	}

	async sendQuery() {
		let queryResponse;

		try {
			switch (this.getType()) {
			case 'nearest':
				queryResponse = await sendQuery('nearestDepartures', {lat: this.props.lat, lon: this.props.lon, maxDistance: this.props.maxDistance, maxResults: this.props.numberOfDepartures*4});
				break;
			case 'stop':
				queryResponse = await sendQuery('stopDepartures', (Array.isArray(this.props.stopCode) ? this.props.stopCode : [this.props.stopCode]).map(code => ({stopCode: code})));
				break;
			default:
				this.setState({data: {error: 'Unsupported timetable type'}});
				return;
			}
			this.setState({
				data: queryResponse
			});
		} catch(error) {
			this.setState({data: {error: error.toString()}});
		}
	}

	getType() {
		if (this.props.lat && this.props.lon) {
			return 'nearest';
		}
		else if (this.props.stopCode) {
			return 'stop';
		}
		else {
			return 'none';
		}
	}

	getDepartureInfoArray() {
		return (Array.isArray(this.state.data) ? this.state.data : []);
	}

	componentDidMount() {
		this.setState({intervalId: setInterval(() => {
			this.sendQuery();
		}, 10e3)});
		return this.sendQuery();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.lat === prevProps.lat && this.props.lon === prevProps.lon && this.props.stopCode === prevProps.stopCode) return;

		if (prevState.data.hasOwnProperty('error')) {
			this.setState({loading: 'Waiting for timetable data from HSL API.'});
		}
		this.sendQuery();
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}

	render() {
		const departureInfoArray = this.getDepartureInfoArray();

		let n_stop_codes = 0;
		if (this.getType() === 'stop') {
			n_stop_codes = departureInfoArray.map(departure => departure.stoptimes[0].stop.code).filter((code, index, array) => array.indexOf(code) === index).length;
		}

		let n_stop_names = 0;
		if (this.getType() === 'stop') {
			n_stop_names = departureInfoArray.map(departure => departure.stoptimes[0].stop.name).filter((name, index, array) => array.indexOf(name) === index).length;
		}

		return (
			<CSValidatorChanger error={this.state.data.error} loading={this.state.data.loading}>
				<ul className='Timetable'>
					{
						departureInfoArray.map(departureInfoArrayItem => {
							return (this.getType() === 'nearest') ?
								<DepartureInfo key={departureInfoArrayItem.node.place.stoptimes[0].trip.gtfsId} showPlatform={true} showStopName={true} distance={departureInfoArrayItem.node.distance} stoptime={departureInfoArrayItem.node.place.stoptimes}/> :
								<DepartureInfo key={departureInfoArrayItem.stoptimes[0].stop.gtfsId} showPlatform={n_stop_codes > 1} showStopName={n_stop_names > 1} stoptime={departureInfoArrayItem.stoptimes}/>;
						})
					}
				</ul>
			</CSValidatorChanger>
		);
	}
}

TimeTable.defaultProps = {
	lat: 0,
	lon: 0,
	stopCode: '',
	maxDistance: 150,
	numberOfDepartures: 25
};

TimeTable.propTypes = {
	lat: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.array
	]),
	lon: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.array
	]),
	stopCode: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.array
	]),
	maxDistance: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.array
	]),
	numberOfDepartures: PropTypes.number,
	filterOut: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.array
	])
};

export default TimeTable;
