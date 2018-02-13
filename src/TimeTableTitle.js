import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './TimeTableTitle.css';

import { CSTitle } from 'chillisalmon';
import './Theme.css';

class TimeTableTitle extends Component {
	constructor(props) {
		super(props);
		this.state = { time: moment().format('HH:mm') };
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
			<CSTitle className='timetable-title'>
				<div className='timetable-title-text timetable-title-element'>
					{this.props.children}
				</div>
				<div className='timetable-title-time timetable-title-element'>
					{this.state.time}
				</div>
			</CSTitle>
		);
	}
}

TimeTableTitle.defaultProps = {
	children: 'Nearest departures'
};

TimeTableTitle.propTypes = {
	children: PropTypes.node
};


export default TimeTableTitle;
