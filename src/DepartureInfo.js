import React, { Component } from 'react';
import './DepartureInfo.css';

class DepartureInfo extends Component {
	render() {
        var hideStopInfo = (this.props.stop.name === "Stop name" || this.props.header.toLowerCase() === "stop") ? "hide" : "";
        var rowClass = (this.props.row % 2) ? "odd" : "even";
        rowClass = this.props.header ? "header" : rowClass;
		return (
            <div className={"departure " + rowClass}>
                <ul>
                    <li className="route type"> {this.props.stoptime.trip.route.mode} </li>
                    <div className={"stop " + hideStopInfo}>
                        <li className="stop code"> {this.props.stop.name} </li>
                        <li className="stop name"> {this.props.stop.code} </li>
                        <li className="stop platform"> {this.props.stop.platformCode} </li>
                    </div>
                    <li className="route number"> {this.props.stoptime.trip.route.shortName} </li>
                    <li className="route destination"> {this.props.stoptime.stopHeadsign} </li>
                    <li className="route deptime"> {DepartureInfo.departureTimeToStr(this.props.stoptime.realtimeArrival, this.props.stoptime.realtime)} </li>
                </ul>
            </div>
		);
	}

    static currentTimeInMinutes() {
        var curTime = new Date();
        return curTime.getHours()*60 + curTime.getMinutes();
    }

    static parseHour(seconds) {
        var h = (~~(seconds/3600));
        h = h > 23 ? h - 24 : h;
        return h;
    }

    static parseTime(seconds, delim = ':') {
        var h = this.parseHour(seconds);

        var hStr = h.toString();
        hStr = hStr.length < 2 ? " " + hStr : hStr;
        var minStr = (~~((seconds%3600)/60)).toString();
        minStr = minStr.length < 2 ? "0" + minStr : minStr;

        return hStr + delim + minStr;
    }

    static departureTimeToStr(seconds, isRealTime = false) {
        if (seconds === 0) {
            return "Time";
        }

        var departureInMinutes =  DepartureInfo.parseHour(seconds)*60 + (~~((seconds%3600)/60)) - DepartureInfo.currentTimeInMinutes();

        return (isRealTime ? ' ' : '~') + (((departureInMinutes < 10) && (departureInMinutes >= 0)) ?
            (departureInMinutes + " min") :
            DepartureInfo.parseTime(seconds));
    }
}

DepartureInfo.defaultProps = {
    "stop": {
        "name": "Stop name",
        "code": "Stop code",
        "platformCode": "Platform",
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
    "header": "",
    "row": 0
};

export default DepartureInfo;
