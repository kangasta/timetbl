import React, { Component } from 'react';
import './TimeTable.css';
import APIQuery from './APIQuery.js'
import DepartureInfo from './DepartureInfo.js'
import Error from './Error.js'
import Loading from './Loading.js'

class TimeTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data : {}
		};
	}

    sendQuery() {
        var self = this;
        var queryResponsePromise;

        switch (self.getType()) {
            case "nearest":
                queryResponsePromise = APIQuery.getNearestDepartures();
                break;
            case "stop":
                queryResponsePromise = APIQuery.getStopDepartures();
                break;
            default:
                console.error("Unsupported timetable type.");
                return;
        }

        queryResponsePromise.then((responseJson) => {
			console.log("Update state.")
			self.setState({
				data: responseJson
			})
		})
		.catch((error) => {
			console.error(error);
		});
    }

    getType() {
        if (this.props.lat !== 0 && this.props.lon !== 0) {
            return "nearest";
        }
        else if (this.props.stopCode) {
            return "stop";
        }
        else {
            return "none"
        }
    }

    hasValidState() {
        return this.state.data.hasOwnProperty('stops') || this.state.data.hasOwnProperty('nearest');
    }

    getDepartureInfoArray() {
        var departureInfoArray;
        switch (this.getType()) {
            case "nearest":
                departureInfoArray = this.state.data.nearest.edges.filter((a) => { return a.node.place.stoptimes.length > 0; });
                departureInfoArray.sort((a,b) => {
                    return (a.node.place.stoptimes[0].serviceDay - b.node.place.stoptimes[0].serviceDay) ?
                        (a.node.place.stoptimes[0].serviceDay - b.node.place.stoptimes[0].serviceDay) :
                        (a.node.place.stoptimes[0].realtimeArrival - b.node.place.stoptimes[0].realtimeArrival);
                    }
                );
                return departureInfoArray;
            case "stop":
                departureInfoArray = this.state.data.stops.filter((a) => { return a.gtfsId.includes("HSL"); });
                departureInfoArray[0].stoptimesWithoutPatterns.sort((a,b) => {
                    return (a.serviceDay - b.serviceDay) ?
                        (a.serviceDay - b.serviceDay) :
                        (a.realtimeArrival - b.realtimeArrival);
                    }
                );
                return departureInfoArray[0].stoptimesWithoutPatterns;
            default:
                console.error("Unsupported timetable type.");
        }
        return departureInfoArray;
    }

    componentDidMount() {
		this.sendQuery();
    var intervalId = setInterval(() => {this.sendQuery()}, 10000);
		this.setState({intervalId: intervalId});
	}

    componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}

    render() {
		if (this.getType() === "none") {
            return <Error name="Unsupported timetable type" message="Component was probably initialised with out giving it any props. At least lat and lon or stopCode should be passed."/>;
        }
        if (!this.hasValidState()) {
			return <Loading />;
		}
        var departureInfoArray = this.getDepartureInfoArray();

        return (
			<div>
                <DepartureInfo header={this.getType()}/>
				{
                    departureInfoArray.map((departureInfoArrayItem, i) => {
                    return (this.getType() === "nearest") ?
                        <DepartureInfo stop={departureInfoArrayItem.node.place.stop} stoptime={departureInfoArrayItem.node.place.stoptimes[0]} key={i} row={i}/> :
                        <DepartureInfo stoptime={departureInfoArrayItem} key={i} row={i}/>;
                    })
                }
			</div>
		)
	}
}

TimeTable.defaultProps = {
    lat: 0,
    lon: 0,
    stopCode: "",
    maxDistance: 150,
    numberOfDepartures: 15
};

export default TimeTable;

