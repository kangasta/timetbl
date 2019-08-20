import React from 'react';
// @ts-ignore
import { CSValidatorChanger } from 'chillisalmon';

import { ViewType, StateType } from '../Store/reducer';
import { BikeStation, NearestNode } from '../ApiUtils';
import { connect } from 'react-redux';
import { DestinationItem } from './Utils';

export function BikesList({data, loading, error}: ViewType) {
	const bikesArray = data as NearestNode<BikeStation>[];

	return (
		<CSValidatorChanger error={error} loading={loading}>
			<ul className='BikesList Timetable'>
				{bikesArray.map((bikesItem, i) => (
					<li key={i} className='DepartureInfo ListItem'>
						<ul className='DepartureList'>
							<li className={'Departure ' + (bikesItem.node.place.realtime ? 'Realtime' : 'Scheduled')}>{bikesItem.node.place.bikesAvailable.toString() || '0'}</li>
							<li className='Departure'>{bikesItem.node.distance < 1000 ? bikesItem.node.distance.toString() + ' m' : (Math.round(bikesItem.node.distance/100)/10).toString() + ' km'}</li>
						</ul>
						<div className='Destination NoDetails'>
							{(bikesItem.node.place.name || '').split(',').map(destination => <DestinationItem destination={destination}/>)}
						</div>
					</li>
				))}
			</ul>
		</CSValidatorChanger>
	);
}

const mapStateToProps = ({view}: StateType): ViewType => {
	return view;
};

export default connect<ViewType>(
	mapStateToProps
)(BikesList);
