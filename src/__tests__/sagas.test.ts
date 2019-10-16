import { runSaga } from 'redux-saga';

import { getData, update } from '../Store/sagas';
import { reducer, LocationType } from '../Store/reducer';

import * as ApiUtils from '../ApiUtils';

const defaultState = reducer();

const coordsLocation: LocationType = {
  position: {
    lat: 10,
    lon: 20,
    maxDistance: 30,
    maxResults: 40
  },
  follow: true
};

const stopsLocation: LocationType = {
  stopCodes: ['1234'],
  follow: false
};

describe('update', (): void => {
  it('dispatches GET_DATA and GET_LOCATION actions', (): void => {
    [true, false].forEach((follow): void => {
      const dispatch = jest.fn();
      const getState = () =>
        Object.assign({}, defaultState, {
          location: { follow: follow }
        });

      runSaga({ dispatch, getState }, update);

      expect(dispatch).toHaveBeenCalledWith({ type: 'GET_DATA' });
      if (follow) {
        expect(dispatch).toHaveBeenCalledWith({ type: 'GET_LOCATION' });
      }
    });
  });
});

describe('getData', (): void => {
  it('sends an API query', (): void => {
    [
      { type: 'nearestBikes', location: coordsLocation },
      { type: 'nearestDepartures', location: coordsLocation },
      { type: 'nearestStops', location: coordsLocation },
      { type: 'stopDepartures', location: stopsLocation }
    ].forEach(async ({ location, type }) => {
      const sendQuery = jest
        .spyOn(ApiUtils, 'sendQuery')
        .mockImplementation(() => Promise.resolve([]));
      const dispatch = jest.fn();
      const getState = () =>
        Object.assign({}, defaultState, { location }, { view: { type } });

      await runSaga({ dispatch, getState }, getData).toPromise();

      let parameters;
      if (type === 'stopDepartures') {
        parameters = location.stopCodes.map((i: string): object => ({
          stopCode: i
        }));
      } else {
        parameters = location.position;
      }

      expect(sendQuery).toHaveBeenCalledWith(type, parameters);
      expect(dispatch).toHaveBeenCalledWith({
        type: 'NEW_DATA',
        metadata: { type, data: [] }
      });
    });
  });
  it('returns error when no stops given for stopDepartures', async () => {
    const sendQuery = jest
      .spyOn(ApiUtils, 'sendQuery')
      .mockImplementation(() => Promise.resolve([]));
    const type = 'stopDepartures';
    const dispatch = jest.fn();
    const getState = () => Object.assign({}, defaultState, { view: { type } });

    await runSaga({ dispatch, getState }, getData).toPromise();

    expect(sendQuery).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith({
      type: 'NEW_DATA',
      metadata: { type, data: [], loading: null, error: 'No stops given' }
    });
  });
});
