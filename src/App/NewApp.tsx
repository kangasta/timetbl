import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { StateType, Action } from '../reducer';
import { QueryTypeT } from '../ApiUtils';

export function App({view, hashChange}: {view: QueryTypeT, hashChange: (hash: string) => Action}) {
	return <div className={'App'}>{view}</div>
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
