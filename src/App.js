import React, { Component } from 'react';
import './App.css';
import { getNearestDepartures } from './APIQuery.js'
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
		getNearestDepartures()
		.then((responseJson) => {self.setState({
			data: responseJson
		})});
	}

	render() {
		if (!this.state.data.hasOwnProperty('nearest')) {
			return <Loading />;
		}
		var departureInfoArray = this.state.data.nearest.edges.filter(function(a){ return a.node.place.stoptimes.length > 0; });
		departureInfoArray.sort(function(a,b){
			return (a.node.place.stoptimes[0].serviceDay - b.node.place.stoptimes[0].serviceDay) ?
				(a.node.place.stoptimes[0].serviceDay - b.node.place.stoptimes[0].serviceDay) :
				(a.node.place.stoptimes[0].realtimeArrival - b.node.place.stoptimes[0].realtimeArrival); });
		return (
			<div>
				{departureInfoArray.map(function(departureInfoArrayItem, i){
					console.log(JSON.stringify(departureInfoArrayItem, null, 2));
					return <DepartureInfo info={departureInfoArrayItem.node.place} key={i}/>;
				})}
			</div>
		)
	}
}

export default App;
