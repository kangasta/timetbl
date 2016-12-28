import React, { Component } from 'react';
import './DepartureInfo.css';

class DepartureInfo extends Component {
	render() {
        var hideStopInfo = (this.props.stop.name === "Stop name") ? "hide" : "";

		return (
            <div className="departure">
                <ul>
                    <li className="route type"> {this.props.stoptime.trip.route.mode} </li>
                    <div className={"stop " + hideStopInfo}>
                        <li className="stop code"> {this.props.stop.name} </li>
                        <li className="stop name"> {this.props.stop.code} </li>
                        <li className="stop platform"> {this.props.stop.platformCode} </li>
                    </div>
                    <li className="route number"> {this.props.stoptime.trip.route.shortName} </li>
                    <li className="route destination"> {this.props.stoptime.stopHeadsign} </li>
                    <li className="route number"> {this.props.stoptime.trip.route.shortName} </li>
                    <li className="route destination"> {this.parseTime(this.props.stoptime.realtimeArrival, this.props.stoptime.realtime)} </li>
                </ul>
            </div>
		);
	}

    currentTimeInMinutes() {
        var curTime = new Date();
        return curTime.getHours()*60+ curTime.getMinutes();
    }

    parseTime(seconds, isRealTime) {
        isRealTime = isRealTime || false;

        var departureInMinutes =  (~~(seconds/3600))*60 + (~~((seconds%3600)/60));

        var hStr = (~~(seconds/3600)).toString();
        hStr = hStr.length < 2 ? " " + hStr : hStr;
        var minStr = (~~((seconds%3600)/60)).toString();
        minStr = minStr.length < 2 ? "0" + minStr : minStr;

        return (isRealTime ? ' ' : '~') + (((departureInMinutes - this.currentTimeInMinutes()) < 10) ?
            ((departureInMinutes - this.currentTimeInMinutes()).toString() + " min")  :
            (hStr + ':' + minStr));
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
    "stoptime": {
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
    },
    "key": 0
};

export default DepartureInfo;
