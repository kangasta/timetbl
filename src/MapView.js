import React, { Component } from 'react';
import ErrorMsg from './ErrorMsg.js';
import './MapView.css';

class MapView extends Component {
	constructor(props) {
		super(props);
		this.state = {error: {
			name: 'Not implemented',
			message: 'This should probably be coded at some point.'
		}};
	}

	render() {
		if (this.state.hasOwnProperty('error')) {
			return (
				<div className='map-view'>
					<ErrorMsg name={this.state.error.name} message={this.state.error.message}/>
				</div>
			);
		}
		return (
			<div className='map-view'>
				TODO
			</div>
		);
	}
}

MapView.defaultProps = {
	lat: 0,
	lon: 0,
	zoom: 1,
	hd: true
};

MapView.propTypes = {
	lat: React.PropTypes.number,
	lon: React.PropTypes.number,
	zoom: React.PropTypes.number,
	hd: React.PropTypes.bool
};

export default MapView;
