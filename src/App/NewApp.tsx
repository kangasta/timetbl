import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { StateType, Action } from '../Store/reducer';
import { QueryTypeT } from '../ApiUtils';

import { Title } from '../Components';
import { TimeTable } from '../Components';

export function App({view, hashChange}: {view: QueryTypeT, hashChange: (hash: string) => Action}) {
	const pushNewHash = (): void => {
		const match = window.location.href.match(/#.*/);
		const hash = match ? match[0] : '';

		hashChange(hash);
	}

	useEffect(() => {
		pushNewHash();

		window.addEventListener('hashchange', pushNewHash);
		return () => {
			window.removeEventListener('hashchange', pushNewHash);
		}
	}, []);

	return (
		<div className={'App'}>
			<Title/>
			<TimeTable/>
		</div>
	);
}

interface StateProps {
	view: QueryTypeT;
}
const mapStateToProps = (state: StateType): StateProps => {
	return {
		view: state.view.type as QueryTypeT,
	}
};

interface DispatchProps {
	hashChange: (hash: string) => Action;
}
const mapDispatchToProps = (dispatch: (args: Action) => Action): DispatchProps => {
	return {
		hashChange: (hash: string) => dispatch({type: 'HASH_CHANGE', metadata: {hash}}),
	}
};

export default connect<StateProps, DispatchProps>(
	mapStateToProps,
	mapDispatchToProps
)(App);
