import React, { useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { CSExpandable } from 'chillisalmon';

import { StateType, Action } from '../Store/reducer';
import { QueryTypeT } from '../ApiUtils';

import { Title } from '../Components';
import { BikesList, NavBar, StopMenu, TimeTable } from '../Components';

import './App.css';
import './Theme.css';

interface StateProps {
	type: QueryTypeT;
}

interface DispatchProps {
	hashChange: (hash: string) => Action;
	navigate: (type: QueryTypeT) => Action;
	update: () => Action;
}

const AppDiv = styled.div`
	.CSExpandable {
		text-align: center;
	}

	.CSExpandable .Icon {
		font-size: 0.666em;
	}
`;

export function App({type, hashChange, navigate, update}: DispatchProps & StateProps) {
	const pushNewHash = (): void => {
		const match = window.location.href.match(/#.*/);
		const hash = match ? match[0] : '';

		hashChange(hash);
	};

	useEffect(() => {
		pushNewHash();

		const updateId = setInterval(update, 20e3);
		window.addEventListener('hashchange', pushNewHash);

		return () => {
			clearInterval(updateId);
			window.removeEventListener('hashchange', pushNewHash);
		};
	}, []);

	const navButtons = [
		{
			text: 'Nearby',
			onClick: () => { navigate('nearestDepartures'); },
			disabled: type === 'nearestDepartures',
		},
		{
			text: 'Bikes',
			onClick: () => { navigate('nearestBikes'); },
			disabled: type === 'nearestBikes',
		},
		{
			text: 'Menu',
			onClick: () => { navigate('nearestStops'); },
			disabled: type === 'nearestStops',
		}
	];

	const View = () => {
		switch(type){
			case 'nearestBikes':
				return <BikesList/>;
			case 'nearestStops':
				return <StopMenu/>;
			case 'nearestDepartures':
			case 'stopDepartures':
				return <TimeTable/>;
	}};

	const theme = type === 'nearestBikes' ? 'BikesTheme' : 'MainTheme';

	return (
		<AppDiv className={`App ${theme}`}>
			<Title/>
			<CSExpandable>
				<NavBar buttons={navButtons}/>
			</CSExpandable>
			<View/>
			<div className='Whitespace'/>
				<div className='Background'/>
				<div className='Footer'>
					<a className='Link' href='https://github.com/kangasta/timetbl'>kangasta / timetbl</a>
					<span className='Divider'>|</span>
					<a className='Link' href='https://digitransit.fi/en/developers/'>data source</a>
				</div>
		</AppDiv>
	);
}

const mapStateToProps = (state: StateType): StateProps => {
	return {
		type: state.view.type as QueryTypeT,
	};
};

const mapDispatchToProps = (dispatch: (args: Action) => Action): DispatchProps => {
	return {
		hashChange: (hash: string) => dispatch({type: 'HASH_CHANGE', metadata: {hash}}),
		navigate: (type: QueryTypeT) => dispatch({type: 'NAVIGATE', metadata: {type}}),
		update: () => dispatch({type: 'UPDATE'}),
	};
};

export default connect<StateProps, DispatchProps>(
	mapStateToProps,
	mapDispatchToProps
)(App);
