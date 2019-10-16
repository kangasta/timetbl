import deepFreeze from 'deep-freeze';

import { reducer, Action, StateType } from '../Store/reducer';

const defaultState = reducer();
deepFreeze(defaultState);

describe('reducer', (): void => {
  it('handles HASH_CHANGE', (): void => {
    const action = {
      type: 'HASH_CHANGE',
      metadata: {
        hash: '#/stop?code=kamppi'
      }
    } as Action;
    deepFreeze(action);
    const newState = {
      location: {
        title: undefined,
        position: undefined,
        stopCodes: ['kamppi'],
        follow: false
      },
      view: {
        type: 'stopDepartures',
        data: [],
        loading: undefined,
        error: undefined
      }
    } as StateType;

    expect(reducer(defaultState, action)).toEqual(newState);
  });
  it('handles NAVIGATE', (): void => {
    const action = {
      type: 'NAVIGATE',
      metadata: {
        type: 'stopDepartures',
        location: {
          follow: false,
          stopCodes: ['Kamppi']
        }
      }
    } as Action;
    deepFreeze(action);
    const newState = {
      location: {
        stopCodes: ['Kamppi'],
        follow: false
      },
      view: {
        type: 'stopDepartures',
        data: [],
        loading: 'Loading data from HSL API'
      }
    } as StateType;

    expect(reducer(defaultState, action)).toEqual(newState);
  });
});
