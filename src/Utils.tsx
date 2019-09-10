import React from 'react';
import { AlertSeverity } from './ApiUtils';

export function DestinationItem({destination}: {destination: string}) {
	const metro = destination.match(/\(M\)/);
	destination = destination.replace('(M)','').trim();

	return (
		<span key={destination} className='DestinationItem'>
			{destination}
			{metro && <span className='Metro'>M</span>}
		</span>
	);
}

export function AlertSymbol({severity}: {severity?: AlertSeverity}) {
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
					<circle cx='32' cy='32' r='30' fill='white'/>
					<path d='M 32 16 v 20' stroke='black' strokeWidth='6' fill='none' strokeLinecap='round'/>
					<circle cx='32' cy='50' r='3' fill='black'/>
				</mask>
			</defs>
			<rect x='0' y='0' width='64' height='64' mask={`url(#${mask})`}/>
		</svg>
	);
}

export class TimeUtils {
	static currentTimeInMinutes() {
		const curTime = new Date(Date.now());
		return curTime.getHours()*60 + curTime.getMinutes();
	}

	static parseHour(seconds: number, max23=true) {
		let h = (~~(seconds/3600));
		h = h > 23 && max23 ? h - 24 : h;
		return h;
	}

	static parseMinute(seconds: number, max23=true) {
		let min = (~~(seconds/60));
		min = min > 24*60 && max23 ? min - 24*60 : min;
		return min;
	}

	static parseTime(seconds: number, delim = ':') {
		const h = TimeUtils.parseHour(seconds);

		let hStr = h.toString();
		hStr = hStr.length < 2 ? ' ' + hStr : hStr;
		let minStr = (~~((seconds%3600)/60)).toString();
		minStr = minStr.length < 2 ? '0' + minStr : minStr;

		return hStr + delim + minStr;
	}

	static departureTimeToStr(seconds: number, showInMinutesLimit = 10) {
		let departureInMinutes = TimeUtils.parseMinute(seconds) - TimeUtils.currentTimeInMinutes();
		departureInMinutes = departureInMinutes < 0 ? (departureInMinutes + 24*60) : departureInMinutes;

		return (((departureInMinutes < showInMinutesLimit) && (departureInMinutes >= 0)) ?
			(departureInMinutes + ' min') :
			TimeUtils.parseTime(seconds));
	}
}

export function getField<T=unknown>(obj: any, fieldString: string): T | undefined {
	try {
		return fieldString.split(/[.[]/).reduce<T>((o: any, i: string): any => {
			const numberMatch = i.match(/([0-9]+)\]/);
			const key = numberMatch ? Number(numberMatch[1]) : i;

			if (key === '') {
				return o;
			}

			return o[key];
		}, obj);
	} catch(e) {
		return undefined;
	}
}

export function getUniqueFilter(field: string){
	return function <T>(element: T, index: number, array: T[]): boolean {
		return array.findIndex(
			i => (getField(i, field) === getField(element, field))
		) === index;
	};
}
