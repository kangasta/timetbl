import React, {useState} from 'react';

import { StoptimeData, TransportRoute, AlertSeverity, Stop } from '../ApiUtils';
import { AlertSymbol, DestinationItem, departureTimeToStr } from './Utils';

import '../Style/DepartureInfo.css';

function Route({shortName, mode}: TransportRoute) {
	const match = shortName.match(/(M*[0-9]+)([a-zA-Z]*)/);
	const number = !match ? shortName : match[1];

	return (
		<div className='Route'>
			<span className={`Code ${mode}`}>
				<span className='Number'>{number}</span>
				{match ? <span className='Letters'>{match[2]}</span> : null}
			</span>
		</div>
	);
}

interface AlertControls {
	showAlert: boolean;
	toggleAlert: () => void;
}

function AlertButton({alerts, showAlert, toggleAlert}: TransportRoute & AlertControls) {
	if (alerts.length === 0 || showAlert) return null;
	const severity: AlertSeverity = alerts.every(alert => alert.alertSeverityLevel === 'INFO') ? 'INFO' : 'WARNING';
	return (
		<div className='AlertSymbol' onClick={toggleAlert}>
			<AlertSymbol severity={severity}/>
		</div>
	);
}

function AlertText({alerts, showAlert, toggleAlert, language}: TransportRoute & {showAlert: boolean; language: string; toggleAlert: () => void}) {
	if (!showAlert || alerts.length === 0) {
		return null;
	}

	let alertTexts: string[];
	try {
		alertTexts = alerts.map(alert => (alert.alertDescriptionTextTranslations).find(translation => translation.language === language).text);
	} catch(e) {
		alertTexts = [
			`No alert description for language ${language} available.`
		];
	}

	return (
		<div className='Alerts'>
			{alertTexts.map((alertText, i) => (
				<div key={i} className='AlertText' onClick={toggleAlert}>
					<span className='Left'>
						<AlertSymbol severity={alerts[i].alertSeverityLevel}/>
					</span>
					<span>{alertText}</span>
				</div>
			))}
		</div>
	);
}

function Destinations({className, headsign}: {className: string; headsign: string}) {
	const destinations = (headsign || '').split('via');

	return (
		<div className={`Destination ${className}`}>
			{destinations.map(i => <DestinationItem key={i} destination={i}/>)}
		</div>
	);
}

function Details({stop, showStopName, distance}: {stop: Stop; showStopName?: boolean; distance?: number}) {
	const { name, code, platformCode } = stop;

	return (
		<div className='Details'>
			{showStopName && <DestinationItem destination={name}/>}
			{(showStopName && (code !== null || platformCode !== null)) && ', '}
			{(platformCode === null && code !== null) && ('Stop ' + code)}
			{platformCode !== null && ('Platform ' + platformCode.toString())}
			{(distance !== undefined) && <span className='Distance'>{': ' + distance.toString() + ' m'}</span>}
		</div>
	);
}

interface PropsType {
	stoptimes: StoptimeData[];
	distance?: number;
	showPlatform?: boolean;
	showStopName?: boolean;
}
export function DepartureInfo({stoptimes, distance, showPlatform=false, showStopName=false}: PropsType) {
	const [showAlert, setShowAlert] = useState(false);
	const alertControls = { showAlert, toggleAlert: () => { setShowAlert(!showAlert); }};

	const detailsClass = showPlatform ? 'WithDetails' : 'NoDetails';
	const route = stoptimes[0].trip.route;

	return (
		<li className='DepartureInfo ListItem'>
			<Route {...route}/>
			<ul className='DepartureList'>
				{stoptimes.map((stoptime,i) => (
					<li key={i} className={`Departure ${stoptime.realtime ? 'Realtime' : 'Scheduled'}`}>
						{departureTimeToStr(stoptime.realtimeDeparture)}
					</li>
				))}
			</ul>
			<AlertButton {...alertControls} {...route}/>
			<Destinations className={detailsClass} headsign={stoptimes[0].headsign}/>
			<Details stop={stoptimes[0].stop} {...{distance, showPlatform, showStopName}}/>
			<AlertText language='en' {...alertControls} {...route}/>
		</li>
	);
}

export default DepartureInfo;