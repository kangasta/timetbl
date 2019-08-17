import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSValidatorChanger } from 'chillisalmon';

import { APIQuery, Utils } from '../timetbl';

import '../Style/TimeTable.css';

class BikesList extends Component {
	constructor(props) {
		super(props);
		const data = {loading: 'Waiting for data from HSL API.'};
		this.state = {
			data: data
		};
	}

	sendQuery() {
		const queryResponsePromises= APIQuery.getNearestBikes(this.props.lat, this.props.lon, this.props.maxDistance);

		return Promise.all(queryResponsePromises)
			.then((responseJsons) => responseJsons.reduce((r,i) => {
				r = r.concat(i.nearest.edges); return r;
			}, [])
			)
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
		this.setState({intervalId: setInterval(() => {
			this.sendQuery();
		}, 10e3)});
		return this.sendQuery();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.lat === prevProps.lat && this.props.lon === prevProps.lon) return;

		if (prevState.data.hasOwnProperty('error')) {
			this.setState({loading: 'Waiting for BikesList data from HSL API.'});
		}
		this.sendQuery();
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}

	render() {
		const bikesArray = Array.isArray(this.state.data) ? this.state.data : [];

		return (
			<CSValidatorChanger error={this.state.data.error} loading={this.state.data.loading}>
				<ul className='BikesList Timetable'>
					{bikesArray.map((bikesItem, i) => (
						<li key={i} className='DepartureInfo ListItem'>
							<ul className='DepartureList'>
								<li className={'Departure ' + (bikesItem.node.place.realtime ? 'Realtime' : 'Scheduled')}>{bikesItem.node.place.bikesAvailable.toString() || '0'}</li>
								<li className='Departure'>{bikesItem.node.distance < 1000 ? bikesItem.node.distance.toString() + ' m' : (Math.round(bikesItem.node.distance/100)/10).toString() + ' km'}</li>
							</ul>
							<div className='Destination NoDetails'>
								{(bikesItem.node.place.name || '').split(',').map(Utils.toDestinationItem)}
							</div>
						</li>
					))}
				</ul>
			</CSValidatorChanger>
		);
	}
}

BikesList.defaultProps = {
	head: '',
	lat: 0,
	lon: 0,
	stopCode: '',
	maxDistance: 150,
	numberOfDepartures: 25
};

BikesList.propTypes = {
	head: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object
	]),
	lat: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.array
	]),
	lon: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.array
	]),
	maxDistance: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.array
	]),
	numberOfDepartures: PropTypes.number,
};

export default BikesList;
