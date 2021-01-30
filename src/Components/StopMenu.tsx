import React from 'react';
import { connect } from 'react-redux';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CSValidatorChanger } from 'chillisalmon';

import { Action, ViewType, StateType } from '../Store/reducer';
import { Stop, NearestNode, QueryTypeT } from '../ApiUtils';
import { NavList } from '../Components';

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

  const links = [
    {
      text: 'All nearby departures',
      onClick: () => {
        navigate('nearestDepartures');
      },
    },
    ...getStopsArray().map(({ name, codes }) => ({
      text: name,
      onClick: () => {
        navigate('stopDepartures', codes, name);
      },
      buttons: codes.map((code: string) => ({
        text: code,
        onClick: () => {
          navigate('stopDepartures', [code]);
        },
      })),
    })),
  ];

  return (
    <CSValidatorChanger error={error} loading={loading}>
      <NavList buttons={links} />
    </CSValidatorChanger>
  );
}

const mapStateToProps = ({ view }: StateType): ViewType => {
  return view;
};

interface DispatchProps {
  navigate: (type: QueryTypeT, stopCodes?: string[], title?: string) => Action;
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

export default connect(mapStateToProps, mapDispatchToProps)(StopMenu);
