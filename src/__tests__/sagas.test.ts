import { runSaga } from 'redux-saga';

import { update } from '../Store/sagas';
import { reducer } from '../Store/reducer';

const defaultState = reducer();

describe('update', (): void => {
	it('dispatches GET_DATA and GET_LOCATION actions', (): void => {
		[true, false].forEach(follow => {
			const dispatch = jest.fn();
			const getState = () => Object.assign({}, defaultState, {
				location: { follow: follow }}
			);
	
			runSaga({ dispatch, getState }, update);
	
			expect(dispatch).toHaveBeenCalledWith({type: 'GET_DATA'});
			if (follow) {
				expect(dispatch).toHaveBeenCalledWith({type: 'GET_LOCATION'});
			}
		});
	});
});
