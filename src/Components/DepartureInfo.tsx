import React, { useState } from 'react';
import styled from 'styled-components';

import { StoptimeData, TransportRoute, AlertSeverity, Stop } from '../ApiUtils';
import { AlertSymbol, DestinationItem, TimeUtils, MainLi } from '../Utils';

const RouteDiv = styled.div`
  float: left;
  font-size: 1.75em;
  margin-right: 0.25em;
  overflow: hidden;
  width: 2.75em;

  span {
    white-space: nowrap;
  }
`;

const LettersSpan = styled.span`
  font-size: 0.666em;
`;

const CodeSpan = styled.span`
  color: white;
  border-radius: 0.125em;
  padding: 0 0.125em;

  &.SUBWAY {
    background: orangered;
  }
  &.RAIL {
    background: purple;
  }
  &.TRAM {
    background: forestgreen;
  }
  &.FERRY {
    background: deepskyblue;
  }
  &.BUS {
    padding: 0;
  }
`;

function Route({ shortName, mode }: TransportRoute) {
  const match = shortName.match(/(M*[0-9]+)([a-zA-Z]*)/);
  const number = !match ? shortName : match[1];

  return (
    <RouteDiv>
      <CodeSpan className={`Code ${mode}`}>
        <span className='Number'>{number}</span>
        {match ? (
          <LettersSpan className='Letters'>{match[2]}</LettersSpan>
        ) : null}
      </CodeSpan>
    </RouteDiv>
  );
}

const AlertSymbolDiv = styled.div`
  float: right;
  font-size: 1em;
  height: 1em;
  margin-top: 0.5em;
  vertical-align: middle;
`;

interface AlertControls {
  showAlert: boolean;
  toggleAlert: () => void;
}

function AlertButton({
  alerts,
  showAlert,
  toggleAlert
}: TransportRoute & AlertControls) {
  if (alerts.length === 0 || showAlert) return null;
  const severity: AlertSeverity = alerts.every(
    alert => alert.alertSeverityLevel === 'INFO'
  )
    ? 'INFO'
    : 'WARNING';
  return (
    <AlertSymbolDiv className='AlertSymbol' onClick={toggleAlert}>
      <AlertSymbol severity={severity} />
    </AlertSymbolDiv>
  );
}

const AlertTextDiv = styled.div`
  background: crimson;
  border-radius: 0.5em;
  font-size: 0.666em;
  margin-top: 0.25em;
  padding: 0.5em;
  padding-left: 3em;
  position: relative;

  .Left {
    float: left;
    font-size: 1.5em;
    height: 1em;
    position: absolute;
    top: 50%;
    transform: translate(-1.5em, -50%);
  }
`;

function AlertText({
  alerts,
  showAlert,
  toggleAlert,
  language
}: TransportRoute & {
  showAlert: boolean;
  language: string;
  toggleAlert: () => void;
}) {
  if (!showAlert || alerts.length === 0) {
    return null;
  }

  let alertTexts: string[];
  try {
    alertTexts = alerts.map(
      alert =>
        alert.alertDescriptionTextTranslations.find(
          translation => translation.language === language
        ).text
    );
  } catch (e) {
    alertTexts = [`No alert description for language ${language} available.`];
  }

  return (
    <div className='Alerts'>
      {alertTexts.map((alertText, i) => (
        <AlertTextDiv key={i} className='AlertText' onClick={toggleAlert}>
          <span className='Left'>
            <AlertSymbol severity={alerts[i].alertSeverityLevel} />
          </span>
          <span>{alertText}</span>
        </AlertTextDiv>
      ))}
    </div>
  );
}

export const DestinationDiv = styled.div`
  min-height: 1.25em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.NoDetails {
    font-size: 1.75em;
  }
`;

function Destinations({
  className,
  headsign
}: {
  className: string;
  headsign: string;
}) {
  const destinations = (headsign || '').split('via');

  return (
    <DestinationDiv className={`Destination ${className}`}>
      {destinations.map(i => (
        <DestinationItem key={i} destination={i} />
      ))}
    </DestinationDiv>
  );
}

const DetailsDiv = styled.div`
  font-size: 0.75em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

function Details({
  stop,
  showStopName,
  distance
}: {
  stop: Stop;
  showStopName?: boolean;
  distance?: number;
}) {
  const { name, code, platformCode } = stop;

  return (
    <DetailsDiv className='Details'>
      {showStopName && <DestinationItem destination={name} />}
      {showStopName && (code !== null || platformCode !== null) && ', '}
      {platformCode === null && code !== null && 'Stop ' + code}
      {platformCode !== null && 'Platform ' + platformCode.toString()}
      {distance !== undefined && (
        <span className='Distance'>{': ' + distance.toString() + ' m'}</span>
      )}
    </DetailsDiv>
  );
}

export const DepartureListUl = styled.ul`
  float: right;
  padding: 0;
  width: 13.13em;
`;

export const DepartureLi = styled.li`
  display: inline-block;
  list-style-type: none;
  margin-left: 0.5em;
  width: 3em;
  white-space: nowrap;

  &.Realtime {
    font-weight: bold;
  }

  :first-child {
    font-size: 1.75em;
  }
`;

interface PropsType {
  stoptimes: StoptimeData[];
  distance?: number;
  showPlatform?: boolean;
  showStopName?: boolean;
}

export function DepartureInfo({
  stoptimes,
  distance,
  showPlatform = false,
  showStopName = false
}: PropsType) {
  const [showAlert, setShowAlert] = useState(false);
  const alertControls = {
    showAlert,
    toggleAlert: () => {
      setShowAlert(!showAlert);
    }
  };

  const detailsClass = showPlatform ? 'WithDetails' : 'NoDetails';
  const route = stoptimes[0].trip.route;

  return (
    <MainLi className='DepartureInfo'>
      <Route {...route} />
      <DepartureListUl className='DepartureList'>
        {stoptimes.map((stoptime, i) => (
          <DepartureLi
            key={i}
            className={`Departure ${
              stoptime.realtime ? 'Realtime' : 'Scheduled'
            }`}
          >
            {TimeUtils.departureTimeToStr(stoptime.realtimeDeparture)}
          </DepartureLi>
        ))}
      </DepartureListUl>
      <AlertButton {...alertControls} {...route} />
      <Destinations className={detailsClass} headsign={stoptimes[0].headsign} />
      {(showStopName || showPlatform) && (
        <Details
          stop={stoptimes[0].stop}
          {...{ distance, showPlatform, showStopName }}
        />
      )}
      <AlertText language='en' {...alertControls} {...route} />
    </MainLi>
  );
}

export default DepartureInfo;
