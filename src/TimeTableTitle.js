import React, { Component } from 'react';
import moment from 'moment';
import './TimeTableTitle.css';

import { CSListElement } from 'chillisalmon';
import './Theme.css';

class TimeTableTitle extends Component {
	constructor(props) {
		super(props);
		this.state = { time: moment().format('HH:mm') };
	}

	getLogo() {
		return (
			<svg className='timetable-title-logo' viewBox="0 0 80 80">
				<defs>
					<mask id="bus-mask">
						<rect x="0" y="0" width="80" height="80" rx="5" ry="5" fill="white"/>
						<rect x="15" y="10" width="50" height="50" rx="5" ry="5" fill="black"/>
						<rect x="20" y="15" width="40" height="30" rx="5" ry="5" fill="white"/>
						<rect x="20" y="55" width="5" height="10" rx="2" ry="2" fill="black"/>
						<rect x="55" y="55" width="5" height="10" rx="2" ry="2" fill="black"/>
						<circle cx="22" cy="52" r="2" fill="white"/>
						<circle cx="58" cy="52" r="2" fill="white"/>
					</mask>
				</defs>

				<rect x="0" y="0" width="80" height="80" rx="5" ry="5" mask="url(#bus-mask)"/>
			</svg>
		);
	}

	componentDidMount() {
		var intervalId = setInterval(() => {
			this.setState({ time: moment().format('HH:mm') });
		});
		this.setState({intervalId: intervalId});
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}

	render() {
		return(
			<CSListElement className='timetable-title'>
				<div className='timetable-title-element'>
					{this.getLogo()}
				</div>
				<div className='timetable-title-text timetable-title-element'>
					Departures
				</div>
				<div className='timetable-title-time timetable-title-element'>
					{this.state.time}
				</div>
			</CSListElement>
		);
	}
}

export default TimeTableTitle;
