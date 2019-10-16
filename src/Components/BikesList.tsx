import React from 'react';
import { connect } from 'react-redux';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { CSValidatorChanger } from 'chillisalmon';

import { ViewType, StateType } from '../Store/reducer';
import { BikeStation, NearestNode } from '../ApiUtils';
import { DestinationItem, MainUl, MainLi } from '../Utils';
import { DepartureListUl, DepartureLi, DestinationDiv } from './DepartureInfo';

export function BikesList({ data, loading, error }: ViewType) {
  const bikesArray = data as NearestNode<BikeStation>[];

  return (
    <CSValidatorChanger error={error} loading={loading}>
      <MainUl className='BikesList Timetable'>
        {bikesArray.map((bikesItem, i) => (
          <MainLi key={i} className='DepartureInfo'>
            <DepartureListUl className='DepartureList'>
              <DepartureLi
                className={
                  'Departure ' +
                  (bikesItem.node.place.realtime ? 'Realtime' : 'Scheduled')
                }
              >
                {bikesItem.node.place.bikesAvailable.toString() || '0'}
              </DepartureLi>
              <DepartureLi className='Departure'>
                {bikesItem.node.distance < 1000
                  ? bikesItem.node.distance.toString() + ' m'
                  : (
                      Math.round(bikesItem.node.distance / 100) / 10
                    ).toString() + ' km'}
              </DepartureLi>
            </DepartureListUl>
            <DestinationDiv className='Destination NoDetails'>
              {(bikesItem.node.place.name || '').split(',').map(destination => (
                <DestinationItem key={destination} destination={destination} />
              ))}
            </DestinationDiv>
          </MainLi>
        ))}
      </MainUl>
    </CSValidatorChanger>
  );
}

const mapStateToProps = ({ view }: StateType): ViewType => {
  return view;
};

export default connect<ViewType>(mapStateToProps)(BikesList);
