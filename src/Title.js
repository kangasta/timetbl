import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../style/Title.css';

class Title extends Component {
	hasText() { return this.props.text !== undefined; }
	hasCoords() { return this.props.lat !== undefined && this.props.lon !== undefined; }

	render() {
		return (
			<div className='Title'>
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
	lat: PropTypes.number,
	lon: PropTypes.number,
	text: PropTypes.string
};

export default Title;
