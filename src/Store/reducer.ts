import { PositionParameters, QueryTypeT } from '../ApiUtils';

export interface LocationType {
  title?: string;
  position?: PositionParameters;
  stopCodes?: string[];
  follow: boolean;
}

export interface ViewType {
  type: QueryTypeT;
  data: object[];
  loading?: string;
  error?: string;
}

export interface StateType {
  location: LocationType;
  view: ViewType;
}

interface HashChangeMetadata {
  hash: string;
}

interface NavigateMetadata {
  type: QueryTypeT;
  location?: LocationType;
}

interface NewDataMetadata {
  type: QueryTypeT;
  data?: object[];
}

export interface Action {
  type:
    | 'HASH_CHANGE'
    | 'NAVIGATE'
    | 'GET_DATA'
    | 'NEW_DATA'
    | 'GET_LOCATION'
    | 'NEW_LOCATION'
    | 'UPDATE';
  metadata?:
    | HashChangeMetadata
    | NavigateMetadata
    | NewDataMetadata
    | LocationType;
}

const getLocation = (params: URLSearchParams): LocationType => {
  const lat = params.get('lat');
  const lon = params.get('lon');
  const code = params.get('code');

  let position;
  if (lat !== null && lon !== null) {
    position = {
      lat: Number(lat),
      lon: Number(lon),
      maxDistance: Number(params.get('r') || 1000),
      maxResults: 30
    };
  }

  return {
    title: params.get('title') || undefined,
    position,
    stopCodes: (code && code.split(',')) || undefined,
    follow: params.get('follow') === 'true'
  };
};

const parseHash = (
  hash: string
): { location: LocationType; type: QueryTypeT } => {
  const paramsMatch = hash.match(/\?.*/);
  const params = new URLSearchParams(paramsMatch ? paramsMatch[0] : '');
  const location = getLocation(params);

  let type: QueryTypeT;
  if (hash.match(/\/menu.*/)) {
    type = 'nearestStops';
  } else if (hash.match(/#\/bikes.*/)) {
    type = 'nearestBikes';
  } else if (hash.match(/#\/stop.*/)) {
    type = 'stopDepartures';
  } /* nearby */ else {
    type = 'nearestDepartures';
  }

  return { type, location };
};

interface LoadingState {
  loading: string | undefined;
  error: string | undefined;
}
const getLocationState = (
  type: QueryTypeT,
  location: LocationType
): LoadingState => {
  let loading, error;

  switch (type) {
    case 'nearestBikes':
    case 'nearestDepartures':
    case 'nearestStops':
      if (location.position === undefined) {
        loading = 'Waiting for location data';
      }
      break;
    case 'stopDepartures':
      if (location.stopCodes === undefined) {
        error = 'No stop codes provided';
      }
      break;
  }
  return { loading, error };
};

export function reducer(prevState?: StateType, action?: Action): StateType {
  if (prevState === undefined) {
    return {
      location: { follow: true },
      view: {
        type: 'nearestDepartures',
        data: [],
        loading: 'Loading data from HSL API'
      }
    };
  }

  let newState;
  switch (action.type) {
    case 'HASH_CHANGE': {
      const hash = (action.metadata as HashChangeMetadata).hash;

      const { location, type } = parseHash(hash);

      newState = Object.assign({}, prevState, { location });
      if (prevState.view.type !== type) {
        newState.view = Object.assign(
          {
            type,
            data: []
          },
          getLocationState(type, location)
        );
      }
      break;
    }
    case 'NAVIGATE': {
      const { type, location } = action.metadata as NavigateMetadata;
      if (type !== prevState.view.type) {
        newState = Object.assign({}, prevState, {
          view: { type, data: [], loading: 'Loading data from HSL API' }
        });
        if (location) {
          newState = Object.assign(newState, { location });
        }
      }
      break;
    }
    case 'NEW_LOCATION': {
      newState = Object.assign({}, prevState, { location: action.metadata });
      break;
    }
    case 'NEW_DATA': {
      const view = action.metadata as NewDataMetadata;
      newState = Object.assign({}, prevState, { view });
      break;
    }
  }

  if (newState === undefined) {
    return prevState;
  }
  return newState;
}
