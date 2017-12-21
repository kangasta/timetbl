import React, { Component } from 'react';
import './App.css';
import TimeTable from './TimeTable.js';
import UserLocation from './UserLocation.js';

import { SFMainFeed, SFGroup, SFValidate } from './simple-feed/src/SF';

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
		if (SFValidate.checkForErrorOrLoading(this.state.data))
		{
			return (
				<div className='app'>
					<SFMainFeed>
						<SFGroup head='Nearest departures:'>
							{SFValidate.generateErrorOrLoadingElement(this.state.data)}
						</SFGroup>
					</SFMainFeed>
				</div>
			);
		}
		return(
			<div className='app'>
				<SFMainFeed>
					<TimeTable head='Nearest departures:' lat={this.state.data.lat} lon={this.state.data.lon} maxDistance={this.state.data.maxDistance} maxResults={15} filterOut={this.state.data.filterOut}/>
				</SFMainFeed>
			</div>
		);
	}
}

export default App;
