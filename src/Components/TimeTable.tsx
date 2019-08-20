import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { CSValidatorChanger } from 'chillisalmon';

import { DepartureInfo } from '../Components';
import { ViewType, StateType } from '../Store/reducer';
import { StoptimesData, NearestNode } from '../ApiUtils';
import { connect } from 'react-redux';

import '../Style/TimeTable.css';

export function TimeTable({type, data, loading, error}: ViewType) {
	data = data as StoptimesData[] | NearestNode<StoptimesData>[];
	let nStopCodes = 0;
	if (type === 'stopDepartures') {
		nStopCodes = data.map((departure: StoptimesData) => departure.stoptimes[0].stop.code).filter((code, index, array) => array.indexOf(code) === index).length;
	}

	let nStopNames = 0;
	if (type === 'stopDepartures') {
		nStopNames = data.map((departure: StoptimesData) => departure.stoptimes[0].stop.name).filter((name, index, array) => array.indexOf(name) === index).length;
	}

	return (
		<CSValidatorChanger error={error} loading={loading}>
			<ul className='Timetable'>
				{
					data.map((departure: StoptimesData | NearestNode<StoptimesData>) => {
						if (type === 'nearestDepartures') {
							departure = departure as NearestNode<StoptimesData>;
							const node = departure.node;
							return <DepartureInfo
								key={node.place.stoptimes[0].trip.gtfsId}
								showPlatform={true}
								showStopName={true}
								distance={node.distance}
								stoptimes={node.place.stoptimes}
							/>;
						} else {
							departure = departure as StoptimesData;
							return <DepartureInfo
								key={departure.stoptimes[0].stop.gtfsId} 
								showPlatform={nStopCodes > 1}
								showStopName={nStopNames > 1}
								stoptimes={departure.stoptimes}
							/>;
						}
					})
				}
			</ul>
		</CSValidatorChanger>
	);
}

const mapStateToProps = ({view}: StateType): ViewType => {
	return view;
};

export default connect<ViewType>(
	mapStateToProps
)(TimeTable);
