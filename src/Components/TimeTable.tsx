import React, { Component } from 'react';
// @ts-ignore
import { CSValidatorChanger } from 'chillisalmon';

// @ts-ignore
import { DepartureInfo } from '../timetbl';
import { ViewType, StateType } from '../Store/reducer';
import { StoptimesData, NearestNode } from '../ApiUtils';
import { connect } from 'react-redux';

export function TimeTable({type, data, loading, error}: ViewType) {
	data = data as StoptimesData[] | NearestNode<StoptimesData>[]
	let n_stop_codes = 0;
	if (type === 'stopDepartures') {
		n_stop_codes = data.map((departure: StoptimesData) => departure.stoptimes[0].stop.code).filter((code, index, array) => array.indexOf(code) === index).length;
	}

	let n_stop_names = 0;
	if (type === 'stopDepartures') {
		n_stop_names = data.map((departure: StoptimesData) => departure.stoptimes[0].stop.name).filter((name, index, array) => array.indexOf(name) === index).length;
	}

	return (
		<CSValidatorChanger error={error} loading={loading}>
			<ul className='Timetable'>
				{
					data.map((departureInfoArrayItem: StoptimesData | NearestNode<StoptimesData>) => {
						if (type === 'nearestDepartures') {
							departureInfoArrayItem = departureInfoArrayItem as NearestNode<StoptimesData>;
							return <DepartureInfo key={departureInfoArrayItem.node.place.stoptimes[0].trip.gtfsId} showPlatform={true} showStopName={true} distance={departureInfoArrayItem.node.distance} stoptime={departureInfoArrayItem.node.place.stoptimes}/>
						} else {
							departureInfoArrayItem = departureInfoArrayItem as StoptimesData;
							return <DepartureInfo key={departureInfoArrayItem.stoptimes[0].stop.gtfsId} showPlatform={n_stop_codes > 1} showStopName={n_stop_names > 1} stoptime={departureInfoArrayItem.stoptimes}/>}
					})
				}
			</ul>
		</CSValidatorChanger>
	);
}

const mapStateToProps = ({view}: StateType): ViewType => {
	return view
};

export default connect<ViewType>(
	mapStateToProps
)(TimeTable);
