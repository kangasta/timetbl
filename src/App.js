import React, { Component } from 'react';
import './App.css';
import TimeTable from './TimeTable.js';
import UserLocation from './UserLocation.js';

import { CSBackground, /*CSBoxElement,*/ CSCenterBox, CSCentered, CSError, CSFooter, CSLoading } from 'chillisalmon';
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
		if (this.state.data.hasOwnProperty('error'))
			return (
				<div className='app app-theme-error'>
					<CSCenterBox>
						<CSError className='app-box'>
							{this.state.data.error}
						</CSError>
					</CSCenterBox>
					<CSBackground className='app-bg'/>
				</div>
			);
		if (this.state.data.hasOwnProperty('loading'))
			return (
				<div className='app app-theme-loading'>
					<CSCenterBox>
						<CSLoading className='app-box'>
							{this.state.data.loading}
						</CSLoading>
					</CSCenterBox>
					<CSBackground className='app-bg'/>
				</div>
			);
		return(
			<div className='app app-theme-default'>
				<CSCenterBox>
					<TimeTable lat={this.state.data.lat} lon={this.state.data.lon} maxDistance={this.state.data.maxDistance} maxResults={15} filterOut={this.state.data.filterOut}/>
				</CSCenterBox>
				<CSBackground className='app-bg'/>
			</div>
		);
	}
}

export default App;
