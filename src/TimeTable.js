import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TimeTable.css';
import APIQuery from './APIQuery.js';
import DepartureInfo from './DepartureInfo.js';

import { SFGroup, SFHead, SFValidate } from './simple-feed/src/SF';

class TimeTable extends Component {
	constructor(props) {
		super(props);
		var data = {loading: 'Waiting for timetable data from HSL API.'};
		if (this.getType() === 'none') {
			data = {error: 'Unsupported timetable type'};
		}
		this.state = {
			data: data
		};
	}

	sendQuery() {
		var self = this;
		var queryResponsePromises;

		switch (this.getType()) {
		case 'nearest':
			queryResponsePromises = APIQuery.getNearestDepartures(this.props.lat, this.props.lon, this.props.maxDistance, this.props.maxResults*5);
			break;
		case 'stop':
			queryResponsePromises = APIQuery.getStopDepartures(this.props.stopCode, this.props.numberOfDepartures);
			break;
		default:
			this.setState({data: {error: 'Unsupported timetable type'}});
			return;
		}

		Promise.all(queryResponsePromises)
			.then((responseJsons) => {
				if (self.getType() === 'nearest' && queryResponsePromises.length > 1)
				{
					var combinedResponseJson = JSON.parse(APIQuery.EmptyNearestQueryResponse);
					for (var i = 0; i < responseJsons.length; i++) {
						combinedResponseJson.data.nearest.edges = combinedResponseJson.data.nearest.edges.concat(responseJsons[i].nearest.edges);
					}
					return combinedResponseJson.data;
				} else {
					return responseJsons[0];
				}
			})
			.then((responseJson) => {
				self.setState({
					data: responseJson
				});
			})
			.catch((error) => {
				self.setState({data: {error: error.toString()}});
			});
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
		var departureInfoArray;
		if (this.getType() === 'nearest') {
			departureInfoArray = this.state.data.nearest.edges.filter((a) => { return a.node.place.stoptimes.length > 0; });
			departureInfoArray.sort((a,b) => {
				const ad = a.node.place.stoptimes[0].serviceDay;
				const bd = b.node.place.stoptimes[0].serviceDay;
				var at = a.node.place.stoptimes[0].realtimeDeparture;
				var bt = b.node.place.stoptimes[0].realtimeDeparture;
				at = (a.node.place.stoptimes[0].scheduledDeparture - at) > 20*3600 ? at + 24*3600 : at;
				bt = (b.node.place.stoptimes[0].scheduledDeparture - bt) > 20*3600 ? bt + 24*3600 : bt;
				return (ad - bd) ?
					(ad - bd) :
					(at - bt);
			});
			if (this.props.filterOut) {
				departureInfoArray = departureInfoArray.filter((a) => {
					var filterOut = Array.isArray(this.props.filterOut) ? this.props.filterOut : [this.props.filterOut];
					return filterOut.every((filter) => {
						return a.node.place.stoptimes[0].stopHeadsign !== filter;
					});
				});
			}
			departureInfoArray = departureInfoArray.slice(0,this.props.maxResults);
			return departureInfoArray;
		} else {
			departureInfoArray = this.state.data.stops.filter((a) => { return a.gtfsId.includes('HSL'); });
			departureInfoArray[0].stoptimesWithoutPatterns.sort((a,b) => {
				return (a.serviceDay - b.serviceDay) ?
					(a.serviceDay - b.serviceDay) :
					(a.realtimeArrival - b.realtimeArrival);
			});
			return departureInfoArray[0].stoptimesWithoutPatterns;
		}
	}

	componentDidMount() {
		this.sendQuery();
		var intervalId = setInterval(() => { this.sendQuery(); }, 10000);
		this.setState({intervalId: intervalId});
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}

	render() {
		if (SFValidate.checkForErrorOrLoading(this.state.data))
		{
			return (
				<SFGroup head={
					<SFHead title='Timetable' info='Location'/>
				}>
					{SFValidate.generateErrorOrLoadingElement(this.state.data)}
				</SFGroup>
			);
		}
		var departureInfoArray = this.getDepartureInfoArray();

		return (
			<SFGroup head={
				<SFHead title='Timetable' info='Location'/>
			}>
				<DepartureInfo header={this.getType()}/>
				{
					departureInfoArray.map((departureInfoArrayItem, i) => {
						return (this.getType() === 'nearest') ?
							<DepartureInfo stop={departureInfoArrayItem.node.place.stop} stoptime={departureInfoArrayItem.node.place.stoptimes[0]} key={i} row={i}/> :
							<DepartureInfo stoptime={departureInfoArrayItem} key={i} row={i}/>;
					})
				}
			</SFGroup>
		);
	}
}

TimeTable.defaultProps = {
	lat: 0,
	lon: 0,
	stopCode: '',
	maxDistance: 150,
	maxResults: 20,
	numberOfDepartures: 15
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
	stopCode: PropTypes.string,
	maxDistance: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.array
	]),
	maxResults: PropTypes.number,
	numberOfDepartures: PropTypes.number,
	filterOut: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.array
	])
};

export default TimeTable;

