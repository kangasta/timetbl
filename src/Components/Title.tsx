import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { StateType } from '../Store/reducer';

import '../Style/Title.css';

interface StateProps {
	clock: boolean;
	lat?: number;
	lon?: number;
	stopCodes?: string[];
	title?: string;
}

export function Title({clock, lat, lon, stopCodes, title}: StateProps) {
	const getTimeStr = () => {
		const time = new Date();
		const h = time.getHours().toString();
		const m = time.getMinutes().toString().padStart(2, '0');

		return `${h}:${m}`;
	};

	const [time, setTime] = useState(getTimeStr());

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTime(getTimeStr());
		}, 15e3);

		return () => {clearInterval(intervalId);};
	});

	if (title === undefined && stopCodes !== undefined) {
		title = stopCodes.join(' ');
	}

	const hasText = () => (title !== undefined);
	const hasCoords = () => (lat !== undefined && lon !== undefined);

	const getCoords = () => {
		if (hasText() || !hasCoords()) return null;
		return [
			{ letter: lat > 0 ? 'N ' : 'S ', number: lat.toString().padEnd(9, '0') },
			{ letter: lon > 0 ? 'E ' : 'W ', number: lon.toString().padEnd(9, '0') }
		].map(coords => (
			<div key={coords.letter} className='Coord'>
				<b>{coords.letter}</b>
				{coords.number}
			</div>
		));
	};

	return (
		<div className='Title'>
			{clock === true ? <div className='Clock'>
				{time}
			</div> : null }
			{hasText() ? <div className='Code'>
				{title}
			</div> : null}
			{getCoords()}
		</div>
	);
}

const mapStateToProps = (state: StateType): StateProps => {
	const {title, position, stopCodes} = state.location;
	const {lat, lon} = position || {lat: undefined, lon: undefined};

	return { lat, lon, stopCodes, title, clock: true };
};

export default connect<StateProps>(
	mapStateToProps
)(Title);
