import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CSValidatorChanger } from 'chillisalmon';

import { Action, ViewType, StateType } from '../Store/reducer';
import { Stop, NearestNode, QueryTypeT } from '../ApiUtils';
import { MainUl, MainLi } from '../Utils';

const NameSpan = styled.span`
  font-size: 1.75em;
`;

export function StopMenu({
  data,
  loading,
  error,
  navigate,
}: ViewType & DispatchProps) {
  const getStopsArray = () => {
    if (data.length === 0) return [];

    const stops = (data as NearestNode<Stop>[])
      .map((i) => i.node.place)
      .reduce((r, i) => {
        const stop = r.find((j) => j.name === i.name);
        if (stop === undefined) {
          r.push({ name: i.name, codes: [i.code] });
        } else {
          if (!stop.codes.includes(i.code)) stop.codes.push(i.code);
        }
        return r;
      }, []);
    return stops;
  };

  return (
    <CSValidatorChanger error={error} loading={loading}>
      <MainUl className='StopMenu'>
        <MainLi
          className='Nearby ListItem'
          onClick={() => navigate('nearestDepartures')}
        >
          <NameSpan className='Name'>All nearby departures</NameSpan>
        </MainLi>
        {getStopsArray().map((stop) => (
          <MainLi className='Stop ListItem' key={stop.name}>
            <NameSpan
              className='Name'
              onClick={() => navigate('stopDepartures', stop.codes, stop.name)}
            >
              {stop.name}
            </NameSpan>
            <ul>
              {stop.codes.map((code: string) => (
                <li
                  className='StopCode'
                  key={code}
                  onClick={() => navigate('stopDepartures', [code])}
                >
                  {code}
                </li>
              ))}
            </ul>
          </MainLi>
        ))}
      </MainUl>
    </CSValidatorChanger>
  );
}

const mapStateToProps = ({ view }: StateType): ViewType => {
  return view;
};

interface DispatchProps {
  navigate: (type: string, stopCodes?: string[], title?: string) => Action;
}
const mapDispatchToProps = (
  dispatch: (args: Action) => Action
): DispatchProps => {
  return {
    navigate: (type: QueryTypeT, stopCodes?: string[], title?: string) =>
      dispatch({
        type: 'NAVIGATE',
        metadata: { type, location: { follow: false, stopCodes, title } },
      }),
  };
};

export default connect<ViewType, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(StopMenu);
