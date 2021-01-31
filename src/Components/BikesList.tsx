import React from 'react';
import { connect } from 'react-redux';

import { ViewType, StateType } from '../Store/reducer';
import { BikeStation, NearestNode } from '../ApiUtils';
import { DestinationItem, MainUl, MainLi } from '../Utils';
import { DepartureListUl, DepartureLi, DestinationDiv } from './DepartureInfo';
import { LoadingWrapper } from './LoadingWrapper';

export function BikesList({ data, loading, error }: ViewType) {
  const bikesArray = data as NearestNode<BikeStation>[];

  return (
    <LoadingWrapper error={error} loading={loading}>
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
              {(bikesItem.node.place.name || '')
                .split(',')
                .map((destination) => (
                  <DestinationItem
                    key={destination}
                    destination={destination}
                  />
                ))}
            </DestinationDiv>
          </MainLi>
        ))}
      </MainUl>
    </LoadingWrapper>
  );
}

const mapStateToProps = ({ view }: StateType): ViewType => {
  return view;
};

export default connect(mapStateToProps)(BikesList);
