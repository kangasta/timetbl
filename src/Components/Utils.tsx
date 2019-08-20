import React from 'react';
import { AlertSeverity } from '../ApiUtils';

export function DestinationItem({destination}: {destination: string}) {
	const metro = destination.match(/\(M\)/);
	destination = destination.replace('(M)','').trim();

	return (
		<span key={destination} className='DestinationItem'>
			{destination}
			{metro ? <span className='Metro'>M</span> : null}
		</span>
	);
}

export function AlertSymbol({severity}: {severity: AlertSeverity}) {
	const mask = severity === 'INFO' ? 'AlertSymbolInfoMask' : 'AlertSymbolWarningMask';

	return (
		<svg className='Symbol Fill' viewBox='0 0 64 64'>
			<defs>
				<mask id="AlertSymbolWarningMask">
					<path d='M 32 4 l 28 56 h -56 l 28 -56' fill='white' stroke='white' strokeWidth='8' strokeLinecap='round' strokeLinejoin='round'/>
					<path d='M 32 20 v 20' stroke='black' strokeWidth='6' fill='none' strokeLinecap='round'/>
					<circle cx='32' cy='54' r='3' fill='black'/>
				</mask>
				<mask id="AlertSymbolInfoMask">
					<circle cx='32' cy='32' r='28' fill='black'/>
					<path d='M 32 20 v 20' stroke='black' strokeWidth='6' fill='none' strokeLinecap='round'/>
					<circle cx='32' cy='54' r='3' fill='black'/>
				</mask>
			</defs>
			<rect x='0' y='0' width='64' height='64' mask={`url(#${mask})`}/>
		</svg>
	);
}

export function currentTimeInMinutes() {
	const curTime = new Date();
	return curTime.getHours()*60 + curTime.getMinutes();
}

export function parseHour(seconds: number, max23=true) {
	let h = (~~(seconds/3600));
	h = h > 23 && max23 ? h - 24 : h;
	return h;
}

export function parseMinute(seconds: number, max23=true) {
	let min = (~~(seconds/60));
	min = min > 24*60 && max23 ? min - 24*60 : min;
	return min;
}

export function parseTime(seconds: number, delim = ':') {
	const h = parseHour(seconds);

	let hStr = h.toString();
	hStr = hStr.length < 2 ? ' ' + hStr : hStr;
	let minStr = (~~((seconds%3600)/60)).toString();
	minStr = minStr.length < 2 ? '0' + minStr : minStr;

	return hStr + delim + minStr;
}

export function departureTimeToStr(seconds: number) {
	if (seconds === 0) {
		return 'Time';
	}

	let departureInMinutes = parseMinute(seconds) - currentTimeInMinutes();
	departureInMinutes = departureInMinutes > 10 || departureInMinutes < 0 ? (parseMinute(seconds) - currentTimeInMinutes() + 24*60) : departureInMinutes;

	return (((departureInMinutes < 10) && (departureInMinutes >= 0)) ?
		(departureInMinutes + ' min') :
		parseTime(seconds));
}

class Utils {
	static toDestinationItem(destination: string) {
		const metro = destination.match(/\(M\)/);
		destination = destination.replace('(M)','').trim();

		return (
			<span key={destination} className='DestinationItem'>
				{destination}
				{metro ? <span className='Metro'>M</span> : null}
			</span>
		);
	}
}

export default Utils;