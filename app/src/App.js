import React, { Component } from 'react';

import { CSBackground, CSCentered, CSTitle, CSValidatorChanger, CSWhiteSpace } from 'chillisalmon';
import TimeTable from 'timetablescreen';
import UserLocation from './UserLocation.js';

import './App.css';
import './Theme.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {data: {
			loading: 'Waiting for user location data from browser.'
		}};
	}

	componentDidMount() {
		var self = this;

		UserLocation.getUserLocation((loc) => {
			self.setState({data: {
				lat:Math.round(loc.coords.latitude*1e6)/1e6,
				lon:Math.round(loc.coords.longitude*1e6)/1e6,
				maxDistance:499
			}});
		}, (error) => {
			this.setState({data: {
				error: error.toString()
			}});
		});
	}

	render() {
		return(
			<div className='app app-theme-default'>
				<CSCentered>
					<CSTitle className='timetable-title'>Nearest departures</CSTitle>
					<CSValidatorChanger error={this.state.data.error} loading={this.state.data.loading}>
						<TimeTable lat={this.state.data.lat} lon={this.state.data.lon} maxDistance={this.state.data.maxDistance} maxResults={12} filterOut={this.state.data.filterOut}/>
					</CSValidatorChanger>
					<CSWhiteSpace/>
				</CSCentered>
				<CSBackground className='app-bg'/>
			</div>
		);
	}
}

export default App;
