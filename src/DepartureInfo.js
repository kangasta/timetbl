import React, { Component } from 'react';
import './DepartureInfo.css';

class DepartureInfo extends Component {
	render() {
		return (
            <ul>
				<li className="route type"> {info.stoptimes[0].trip.route.mode} </li>
				<li className="stop code"> {info.stop.name} </li>
				<li className="stop name"> {info.stop.code} </li>
				<li className="stop platform"> {info.stop.platformCode} </li>
				<li className="route number"> {info.stoptimes[0].trip.route.shortName} </li>
				<li className="route destination"> {info.stoptimes[0].stopHeadsign} </li>
				<li className="route number"> {info.stoptimes[0].trip.route.shortName} </li>
				<li className="route destination"> {parseTime(info.stoptimes[0].realtimeArrival, info.stoptimes[0].realtime)} </li>
			</ul>
        );
	}
}

DepartureInfo.defaultProps = {
  "stop": {
    "name": "Stop name",
    "code": "Stop code",
    "platformCode": "Platform code",
    "desc": "Stop description",
    "lat": 47.916667,
    "lon": 106.916667
  },
  "stoptimes": [
    {
      "trip": {
        "route": {
          "shortName": "Route number",
          "mode": "Route type",
          "alerts": []
        }
      },
      "realtimeArrival": 0,
      "realtimeDeparture": 0,
      "realtime": true,
      "stopHeadsign": "Destination"
    }
  ]
};

export default Loading;
