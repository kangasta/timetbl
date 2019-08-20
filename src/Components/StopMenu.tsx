import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { CSValidatorChanger } from 'chillisalmon';

import { Action, ViewType, StateType } from '../Store/reducer';
import { Stop, NearestNode, QueryTypeT } from '../ApiUtils';
import { connect } from 'react-redux';

import '../Style/StopMenu.css';

export function StopMenu({data, loading, error, navigate}: ViewType & DispatchProps) {
	const getStopsArray = () => {
		if (data.length === 0) return [];
		
		const stops = (data as NearestNode<Stop>[])
			.map(i => i.node.place)
			.reduce((r, i) => {
				const stop = r.find(j => j.name === i.name);
				if (stop === undefined) {
					r.push({name: i.name, codes: [i.code]});
				} else {
					if (!stop.codes.includes(i.code)) stop.codes.push(i.code);
				}
				return r;
			}, []);
		return stops;
	};

	return (
		<CSValidatorChanger error={error} loading={loading}>
			<ul className='StopMenu'>
				<li className='Nearby ListItem' onClick={ () => navigate('nearestDepartures') }>
					<span className='Name'>All nearby departures</span>
				</li>
				{getStopsArray().map(stop => (
					<li className='Stop ListItem' key={stop.name}>
						<span className='Name' onClick={() => navigate('stopDepartures', stop.codes, stop.name)}>{stop.name}</span>
						<ul>
							{stop.codes.map((code: string) => <li className='StopCode' key={code} onClick={() => navigate('stopDepartures', [code])}>{code}</li>)}
						</ul>
					</li>
				))}
			</ul>
		</CSValidatorChanger>
	);
}

const mapStateToProps = ({view}: StateType): ViewType => {
	return view;
};

interface DispatchProps {
	navigate: (type: string, stopCodes?: string[], title?: string) => Action;
}const mapDispatchToProps = (dispatch: (args: Action) => Action): DispatchProps => {
	return {
		navigate: (type: QueryTypeT, stopCodes?: string[], title?: string) => dispatch({type: 'NAVIGATE', metadata: {type, location: {follow: false, stopCodes, title}}}),
	};
};

export default connect<ViewType, DispatchProps>(
	mapStateToProps,
	mapDispatchToProps
)(StopMenu);
