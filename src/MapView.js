import React, { Component } from 'react';
//import ErrorMsg from './ErrorMsg.js';
import Leaflet from 'leaflet';
import './MapView.css';
import 'leaflet/dist/leaflet.css'; // TODO fix this to use css-loader

class MapView extends Component {
	/*constructor(props) {
		super(props);
		this.state = {error: {
			name: 'Not implemented',
			message: 'This should probably be coded at some point.'
		}};
	}*/

	componentDidMount() {
		var map = Leaflet.map('leaflet-map', { zoomControl:false }).setView([this.props.lat,this.props.lon], this.props.zoom);
		Leaflet.tileLayer('http://api.digitransit.fi/map/v1/{id}/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ',
			id: 'hsl-map'}).addTo(map);
		Leaflet.vectorGrid.protobuf('http://api.digitransit.fi/hsl-stop-map/:z/:x/:y.pbf')
		.addTo(map);
	}

	render() {
		/*if (this.state.hasOwnProperty('error')) {
			return (
				<div className='map-view' id='map'>
					<ErrorMsg name={this.state.error.name} message={this.state.error.message}/>
				</div>
			);
		}*/
		return (
			<div className='map-view'>
				<div className='leaflet-container' id='leaflet-map'></div>
			</div>
		);
	}
}

MapView.defaultProps = {
	lat: 0,
	lon: 0,
	zoom: 15,
	hd: true
};

MapView.propTypes = {
	lat: React.PropTypes.number,
	lon: React.PropTypes.number,
	zoom: React.PropTypes.number,
	hd: React.PropTypes.bool
};

export default MapView;


