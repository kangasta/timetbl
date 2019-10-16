import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import { StateType } from '../Store/reducer';

const TitleDiv = styled.div`
  box-sizing: border-box;
  height: 4.5em;
  margin: 0.75em 1.5em;
`;

const CodeClockCommonCss = css`
  font-size: 3em;
  line-height: 1.5em;
`;

const CoordDiv = styled.div`
  font-size: 2em;
`;

const CodeDiv = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${CodeClockCommonCss}
`;

const ClockDiv = styled.div`
  background: var(--theme-color-2);
  border-radius: 0.25em;
  color: var(--theme-color-1);
  float: right;
  padding: 0 0.33em;
  text-align: center;
  width: 2.5em;
  ${CodeClockCommonCss}
`;

interface StateProps {
  clock: boolean;
  lat?: number;
  lon?: number;
  stopCodes?: string[];
  title?: string;
}

export function Title({ clock, lat, lon, stopCodes, title }: StateProps) {
  const getTimeStr = () => {
    const time = new Date();
    const h = time.getHours().toString();
    const m = time
      .getMinutes()
      .toString()
      .padStart(2, '0');

    return `${h}:${m}`;
  };

  const [time, setTime] = useState(getTimeStr());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(getTimeStr());
    }, 15e3);

    return () => {
      clearInterval(intervalId);
    };
  });

  if (title === undefined && stopCodes !== undefined) {
    title = stopCodes.join(' ');
  }

  const hasText = () => title !== undefined;
  const hasCoords = () => lat !== undefined && lon !== undefined;

  const getCoords = () => {
    if (hasText() || !hasCoords()) return null;
    return [
      { letter: lat > 0 ? 'N ' : 'S ', number: lat.toString().padEnd(9, '0') },
      { letter: lon > 0 ? 'E ' : 'W ', number: lon.toString().padEnd(9, '0') }
    ].map(coords => (
      <CoordDiv key={coords.letter} className='Coord'>
        <b>{coords.letter}</b>
        {coords.number}
      </CoordDiv>
    ));
  };

  return (
    <TitleDiv className='Title'>
      {clock && <ClockDiv className='Clock'>{time}</ClockDiv>}
      {hasText() && <CodeDiv className='Code'>{title}</CodeDiv>}
      {getCoords()}
    </TitleDiv>
  );
}

const mapStateToProps = (state: StateType): StateProps => {
  const { title, position, stopCodes } = state.location;
  const { lat, lon } = position || { lat: undefined, lon: undefined };

  return { lat, lon, stopCodes, title, clock: true };
};

export default connect<StateProps>(mapStateToProps)(Title);
