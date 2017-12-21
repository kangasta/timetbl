import React, { Component } from 'react';
import './App.css';
import TimeTable from './TimeTable.js';
import UserLocation from './UserLocation.js';

import { SFMainFeed, SFValidate } from './simple-feed/src/SF';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {data: {
			loading: 'Waiting for user location data from browser.'
		}};
	}

	componentDidMount() {
		var self = this;

		var currentURL = window.location.href;

		if (/kamppi/.exec(currentURL)) {
			self.setState({data: {
				lat:60.169038, lon:24.932908, maxDistance:100, filterOut:'Leppävaara'
			}});
		}
		else if (/kara/.exec(currentURL)) {
			self.setState({data: {
				lat:[60.224655, 60.215923],
				lon:[24.759257, 24.753498],
				maxDistance:[300, 100]
			}});
		} else if (/keskusta/.exec(currentURL)) {
			self.setState({data: {
				lat:60.170508,
				lon:24.941104,
				maxDistance:300,
			}});
		} else if (/mattby/.exec(currentURL)) {
			self.setState({data: {
				lat:60.161874,
				lon:24.739518,
				maxDistance:1000,
				filterOut:'Matinkylä'
			}});
		} else if (/niemi/.exec(currentURL)) {
			self.setState({data: {
				lat:60.186269,
				lon:24.830909,
				maxDistance:1000,
				filterOut:'Otaniemi'
			}});
		} else if (/sello/.exec(currentURL)) {
			self.setState({data: {
				lat:60.219378,
				lon:24.815121,
				maxDistance:325,
				filterOut:'Leppävaara'
			}});
		} else if (/niittari/.exec(currentURL)) {
			self.setState({data: {
				lat:[60.170882,60.167753],
				lon:[24.760174,24.771770],
				maxDistance:[300,150],
			}});
		} else  {
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
	}

	render() {
		if (SFValidate.checkForErrorOrLoading(this.state.data))
		{
			return (
				<SFMainFeed>
					{SFValidate.generateErrorOrLoadingElement(this.state.data)}
				</SFMainFeed>
			);
		}
		return(
			<SFMainFeed>
				<TimeTable lat={this.state.data.lat} lon={this.state.data.lon} maxDistance={this.state.data.maxDistance} maxResults={15} filterOut={this.state.data.filterOut}/>
			</SFMainFeed>
		);
	}
}

export default App;
