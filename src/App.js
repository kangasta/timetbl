import React, { Component } from 'react';
import './App.css';
import { getNearestDepartures } from './APIQuery.js'

var parseTime = function(seconds, isRealTime){
	isRealTime = isRealTime || false;
	return (isRealTime ? ' ' : '~') + (~~(seconds/3600)).toString() + ':' + ((seconds%3600)/60).toString();
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data : {}
		};
	}

	componentDidMount() {
		var self = this;
		getNearestDepartures()
		.then((responseJson) => {self.setState({
			data: responseJson
		})});
	}

	render() {
		if (!this.state.data.hasOwnProperty('nearest')) {
			return <p>No timetable data available.</p>;
		}
		var departureInfoArray = this.state.data.nearest.edges.filter(function(a){ return a.node.place.stoptimes.length > 0; });
		departureInfoArray.sort(function(a,b){ return (a.node.place.stoptimes[0].realtimeArrival) - (b.node.place.stoptimes[0].realtimeArrival); });
		var departureInfo = departureInfoArray[0].node.place

		return (
			<ul>
				<li class="route type"> {departureInfo.stoptimes[0].trip.route.mode} </li>
				<li class="stop code"> {departureInfo.stop.name} </li>
				<li class="stop name"> {departureInfo.stop.code} </li>
				<li class="stop platform"> {departureInfo.stop.platformCode} </li>
				<li class="route number"> {departureInfo.stoptimes[0].trip.route.shortName} </li>
				<li class="route destination"> {departureInfo.stoptimes[0].stopHeadsign} </li>
				<li class="route number"> {departureInfo.stoptimes[0].trip.route.shortName} </li>
				<li class="route destination"> {parseTime(departureInfo.stoptimes[0].realtimeArrival, departureInfo.stoptimes[0].realtime)} </li>
			</ul>
		)
	}
}

export default App;
