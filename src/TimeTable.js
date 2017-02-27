import React, { Component } from 'react';
import './TimeTable.css';
import APIQuery from './APIQuery.js';
import DepartureInfo from './DepartureInfo.js';
import ErrorMsg from './ErrorMsg.js';
import LoadingMsg from './LoadingMsg.js';

class TimeTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data : {}
		};
	}

	static unsupportedTypeErrorString = 'Component was probably initialised with out giving it any props. At least lat and lon or stopCode should be passed.';

	sendQuery() {
		var self = this;
		var queryResponsePromises;

		switch (this.getType()) {
		case 'nearest':
			if (Array.isArray(this.props.lat) && Array.isArray(this.props.lat)){
				queryResponsePromises = APIQuery.getNearestDepartures(this.props.lat, this.props.lon, this.props.maxDistance, this.props.maxResults*5);
			} else {
				queryResponsePromises = APIQuery.getNearestDepartures(this.props.lat, this.props.lon, this.props.maxDistance, this.props.maxResults*5);
			}
			break;
		case 'stop':
			queryResponsePromises = APIQuery.getStopDepartures(this.props.stopCode, this.props.numberOfDepartures);
			break;
		default:
			this.setState({error: {
				name: 'Unsupported timetable type.',
				message: TimeTable.unsupportedTypeErrorString
			}});
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
			self.setState({'error': {
				name: 'Error in APIQuery.',
				message: error.toString()
			}});
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

	hasValidState() {
		return this.state.data.hasOwnProperty('stops') || this.state.data.hasOwnProperty('nearest');
	}

	getDepartureInfoArray() {
		var departureInfoArray;
		switch (this.getType()) {
		case 'nearest':
			departureInfoArray = this.state.data.nearest.edges.filter((a) => { return a.node.place.stoptimes.length > 0; });
			departureInfoArray.sort((a,b) => {
				return (a.node.place.stoptimes[0].serviceDay - b.node.place.stoptimes[0].serviceDay) ?
					(a.node.place.stoptimes[0].serviceDay - b.node.place.stoptimes[0].serviceDay) :
					(a.node.place.stoptimes[0].scheduledDeparture - b.node.place.stoptimes[0].scheduledDeparture);
			});
			if (this.props.filterOut) {
				departureInfoArray = departureInfoArray.filter((a) => {
					var filterOut = Array.isArray(this.props.filterOut) ? this.props.filterOut : [this.props.filterOut];
					return filterOut.every((filter) => {
						//console.log(String(filter) + ', ' + String(a.node.place.stoptimes[0].stopHeadsign) + ', ' + String(a.node.place.stoptimes[0].stopHeadsign !== filter))
						return a.node.place.stoptimes[0].stopHeadsign !== filter;
					});
				});
			}
			departureInfoArray = departureInfoArray.slice(0,this.props.maxResults);
			return departureInfoArray;
		case 'stop':
			departureInfoArray = this.state.data.stops.filter((a) => { return a.gtfsId.includes('HSL'); });
			departureInfoArray[0].stoptimesWithoutPatterns.sort((a,b) => {
				return (a.serviceDay - b.serviceDay) ?
					(a.serviceDay - b.serviceDay) :
					(a.realtimeArrival - b.realtimeArrival);
			});
			return departureInfoArray[0].stoptimesWithoutPatterns;
		default:
			this.setState({error: {
				name: 'Unsupported timetable type.',
				message: TimeTable.unsupportedTypeErrorString
			}});
		}
		return departureInfoArray;
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
		if (this.getType() === 'none') {
			return <ErrorMsg name='Unsupported timetable type' message='Component was probably initialised with out giving it any props. At least lat and lon or stopCode should be passed.'/>;
		}
		if (this.state.hasOwnProperty('error')) {
			return <ErrorMsg name={this.state.error.name} message={this.state.error.msg}/>;
		}
		if (!this.hasValidState()) {
			return <LoadingMsg name='Timetable data' message='Reguest sent to HSL API and waiting for response'/>;
		}
		var departureInfoArray = this.getDepartureInfoArray();

		return (
			<div className='timetable'>
				<DepartureInfo header={this.getType()}/>
				{
					departureInfoArray.map((departureInfoArrayItem, i) => {
						return (this.getType() === 'nearest') ?
							<DepartureInfo stop={departureInfoArrayItem.node.place.stop} stoptime={departureInfoArrayItem.node.place.stoptimes[0]} key={i} row={i}/> :
							<DepartureInfo stoptime={departureInfoArrayItem} key={i} row={i}/>;
					})
				}
			</div>
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
	lat: React.PropTypes.oneOfType([
		React.PropTypes.number,
		React.PropTypes.array
	]),
	lon: React.PropTypes.oneOfType([
		React.PropTypes.number,
		React.PropTypes.array
	]),
	stopCode: React.PropTypes.string,
	maxDistance: React.PropTypes.oneOfType([
		React.PropTypes.number,
		React.PropTypes.array
	]),
	maxResults: React.PropTypes.number,
	numberOfDepartures: React.PropTypes.number,
	filterOut: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.array
	])
};

export default TimeTable;

