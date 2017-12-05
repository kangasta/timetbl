import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Leaflet from 'leaflet';
import 'leaflet.vectorgrid';
import './MapView.css';
import 'leaflet/dist/leaflet.css'; // TODO fix this to use css-loader

class MapView extends Component {
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
	lat: PropTypes.number,
	lon: PropTypes.number,
	zoom: PropTypes.number,
	hd: PropTypes.bool
};

export default MapView;
