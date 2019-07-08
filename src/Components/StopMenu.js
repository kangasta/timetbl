import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSValidatorChanger } from 'chillisalmon';

import { APIQuery } from '../timetbl';

import '../Style/StopMenu.css';

class StopMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				loading: 'Waiting for StopMenu data from HSL API.'
			}
		};
	}

	sendQuery() {
		APIQuery.getNearestStops(this.props.lat, this.props.lon, this.props.maxDistance, this.props.maxResults)
			.then((responseJson) => {
				this.setState({
					data: responseJson
				});
			})
			.catch((error) => {
				this.setState({data: {error: error.toString()}});
			});
	}

	componentDidMount() {
		this.sendQuery();
	}
	
	getStopsArray() {
		if (this.state.data.nearest === undefined) return [];
		
		var stops = this.state.data.nearest.edges
			.map(i => i.node.place)
			.reduce((r, i) => {
				var stop = r.find(j => j.name === i.name);
				if (stop === undefined) {
					r.push({name: i.name, codes: [i.code]});
				} else {
					if (!stop.codes.includes(i.code)) stop.codes.push(i.code);
				}
				return r;
			}, []);
		return stops;
	}

	render() {
		var stopsArray = this.getStopsArray();

		return (
			<CSValidatorChanger error={this.state.data.error} loading={this.state.data.loading}>
				<ul className='StopMenu'>
					<li className='Nearby ListItem' onClick={ () => this.props.navigate('/#/nearby') }>
						<span className='Name'>All nearby departures</span>
					</li>
					{stopsArray.map(stop => (
						<li className='Stop ListItem' key={stop.name}>
							<span className='Name' onClick={() => this.props.navigate('/#/stop?code=' + stop.codes.join(',') + '&title=' + stop.name)}>{stop.name}</span>
							<ul>
								{stop.codes.map(code => <li  className='StopCode' key={code} onClick={() => this.props.navigate('/#/stop?code=' + code)}>{code}</li>)}
							</ul>
						</li>
					))}
				</ul>
			</CSValidatorChanger>
		);
	}
}

StopMenu.defaultProps = {
	lat: 0,
	lon: 0,
	maxDistance: 1000,
	maxResults: 50,
	navigate: () => undefined,
};

StopMenu.propTypes = {
	lat: PropTypes.number,
	lon: PropTypes.number,
	maxDistance: PropTypes.number,
	maxResults: PropTypes.number,
	navigate: PropTypes.func,
};

export default StopMenu;
