import { call, put, select, takeEvery } from 'redux-saga/effects';
import { StateType, LocationType, Action } from './reducer';
import { QueryTypeT, PositionParameters, sendQuery } from '../ApiUtils';

const getLocationAndType = (
  state: StateType
): { type: string; location: LocationType } => ({
  type: state.view.type,
  location: state.location
});

const getNearestQueryStr = (location: LocationType): string => {
  if (location.position === undefined) return '';

  const getPositionParameter = (key: keyof PositionParameters): string =>
    `${key}=${location.position[key]}`;
  return `?${Object.keys(location.position)
    .map(getPositionParameter)
    .join('&')}&follow=${location.follow}`;
};

const getStopsQueryStr = ({ title, stopCodes }: LocationType): string => {
  if (stopCodes === undefined) return '';
  const titleParam = title !== undefined ? `&title=${title}` : '';

  return `?code=${stopCodes.join(',')}${titleParam}`;
};

const generatePath = (
  type: QueryTypeT,
  location: LocationType
): { path: string; query: string } => {
  switch (type) {
    case 'nearestBikes':
      return { path: '/bikes', query: getNearestQueryStr(location) };
    case 'nearestDepartures':
      return { path: '/nearby', query: getNearestQueryStr(location) };
    case 'nearestStops':
      return { path: '/menu', query: getNearestQueryStr(location) };
    case 'stopDepartures':
      return { path: '/stop', query: getStopsQueryStr(location) };
  }
};

function* updateHash({ type: action }: Action) {
  const { type, location } = yield select(getLocationAndType);
  const { path, query } = generatePath(type, location);

  const baseurl = window.location.href.match(/[^#]+/)[0];
  if (action === 'NAVIGATE') {
    window.history.pushState(
      null,
      document.title,
      `${baseurl}#${path}${query}`
    );
  } else {
    window.history.replaceState(
      null,
      document.title,
      `${baseurl}#${path}${query}`
    );
  }

  if (type !== 'stopDepartures' && !query) {
    yield put({ type: 'GET_LOCATION' });
  }
}

const getUserLocation = () =>
  new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject('Geolocation is not supported or allowed by this browser.');
    }
  });

function* getLocation() {
  const { latitude: lat, longitude: lon } = (yield call(
    getUserLocation
  )).coords;

  yield put({
    type: 'NEW_LOCATION',
    metadata: {
      follow: true,
      position: {
        lat: Math.round(lat * 1e6) / 1e6,
        lon: Math.round(lon * 1e6) / 1e6,
        maxDistance: 1500,
        maxResults: 30
      }
    }
  });
}

export function* getData() {
  const { type, location } = yield select(getLocationAndType);

  let parameters;
  if (type === 'stopDepartures') {
    if (location.stopCodes !== undefined && location.stopCodes.length > 0) {
      parameters = location.stopCodes.map((i: string): object => ({
        stopCode: i
      }));
    } else {
      yield put({
        type: 'NEW_DATA',
        metadata: { type, data: [], loading: null, error: 'No stops given' }
      });
      return;
    }
  } else {
    parameters = location.position;
  }
  try {
    const data = yield call(sendQuery, type, parameters);
    yield put({ type: 'NEW_DATA', metadata: { type, data } });
  } catch (e) {
    yield put({
      type: 'NEW_DATA',
      metadata: { type, data: [], error: e.toString() }
    });
  }
}

const getFollow = (state: StateType): boolean => state.location.follow;

export function* update() {
  const follow = yield select(getFollow);
  if (follow) {
    yield put({ type: 'GET_LOCATION' });
  }
  yield put({ type: 'GET_DATA' });
}

export function* saga() {
  yield takeEvery('HASH_CHANGE', updateHash);
  yield takeEvery('NAVIGATE', updateHash);
  yield takeEvery('NEW_LOCATION', updateHash);

  yield takeEvery('GET_LOCATION', getLocation);

  yield takeEvery('GET_DATA', getData);
  yield takeEvery('HASH_CHANGE', getData);
  yield takeEvery('NAVIGATE', getData);
  yield takeEvery('NEW_LOCATION', getData);

  yield takeEvery('UPDATE', update);
}
