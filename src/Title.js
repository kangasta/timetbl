import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../style/Title.css';

class Title extends Component {
	constructor(props) {
		super(props);

		this.state = {time: this.get_time()};
	}

	componentDidMount() {
		if (this.props.clock === true) {
			this.setState({
				clock_interval: setInterval(() => {
					this.setState({time: this.get_time()});
				}, 15e3)
			});
		}
	}

	componentWillUnmount() {
		clearInterval(this.state.clock_interval);
	}

	get_time() {
		const time = new Date();
		const m = time.getMinutes();

		return time.getHours().toString() + ':' + (m < 10 ? '0' + m.toString() : m.toString());
	}

	hasText() { return this.props.text !== undefined; }
	hasCoords() { return this.props.lat !== undefined && this.props.lon !== undefined; }

	render() {
		return (
			<div className='Title'>
				{this.props.clock === true ? <div className='Clock'>
					{this.state.time}
				</div> : null }
				{this.hasText() ? <div className='Code'>
					{this.props.text}
				</div> : null}
				{this.hasCoords() && !this.hasText() ? <div className='Coord'>
					<b>{(this.props.lat > 0 ? 'N ' : 'S ')}</b>
					{this.props.lat}
				</div> : null}
				{this.hasCoords() && !this.hasText() ? <div className='Coord'>
					<b>{(this.props.lon > 0 ? 'E ' : 'W ')}</b>
					{this.props.lon}
				</div> : null}
			</div>
		);
	}
}

Title.propTypes = {
	clock: PropTypes.bool,
	lat: PropTypes.number,
	lon: PropTypes.number,
	text: PropTypes.string
};

export default Title;
