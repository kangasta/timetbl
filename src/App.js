import React, { Component } from 'react';
import './App.css';
import APIQuery from './APIQuery.js'
import Loading from './Loading.js'
import DepartureInfo from './DepartureInfo.js'

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data : {}
		};
	}

	componentDidMount() {
		var self = this;
		//APIQuery.getNearestDepartures()
		APIQuery.getStopDepartures()
		.then((responseJson) => {self.setState({
			data: responseJson
		})});
	}

	render() {
		if (!this.state.data.hasOwnProperty('stops')) {
		//if (!this.state.data.hasOwnProperty('nearest')) {
			return <Loading />;
		}
		var departureInfoArray = this.state.data.stops.filter(function(a){ return a.gtfsId.includes("HSL"); });
		departureInfoArray[0].stoptimesWithoutPatterns.sort(function(a,b){
			return (a.serviceDay - b.serviceDay) ?
				(a.serviceDay - b.serviceDay) :
				(a.realtimeArrival - b.realtimeArrival);
			}
		);
		/*var departureInfoArray = this.state.data.nearest.edges.filter(function(a){ return a.node.place.stoptimes.length > 0; });
		departureInfoArray.sort(function(a,b){
			return (a.node.place.stoptimes[0].serviceDay - b.node.place.stoptimes[0].serviceDay) ?
				(a.node.place.stoptimes[0].serviceDay - b.node.place.stoptimes[0].serviceDay) :
				(a.node.place.stoptimes[0].realtimeArrival - b.node.place.stoptimes[0].realtimeArrival);
			}
		);*/
		return (
			<div>
				<DepartureInfo header="stop"/>
				{departureInfoArray[0].stoptimesWithoutPatterns.map(function(departureInfoArrayItem, i){
					return <DepartureInfo stoptime={departureInfoArrayItem} key={i} row={i}/>;
					//return <DepartureInfo stop={departureInfoArrayItem.node.place.stop} stoptime={departureInfoArrayItem.node.place.stoptimes[0]} key={i} row={i}/>;
				})}
			</div>
		)
	}
}

export default App;
