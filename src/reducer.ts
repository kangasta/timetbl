import { PositionParameters, QueryTypeT } from './ApiUtils'

export interface LocationType {
	title?: string;
	position?: PositionParameters;
	stopCodes?: string[];
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

interface NewDataMetadata {
	type: QueryTypeT;
	data?: object[];
}

export interface Action {
	type: 'HASH_CHANGE' | 'NEW_DATA';
	metadata: HashChangeMetadata | NewDataMetadata;
}

const getLocation = (params: URLSearchParams): LocationType => {
	return {
		title: params.get('title'),
		position: {
			lat: Number(params.get('lat')),
			lon: Number(params.get('lon')),
			maxDistance: Number(params.get('r')),
			maxResults: 30,
		},
		stopCodes: (params.get('code') || '').split(','),
	}
}

const parseHash = (hash: string): {location: LocationType, type: QueryTypeT} => {
	const params_match = hash.match(/\?.*/);
	const params = new URLSearchParams(params_match ? params_match[0] : '');
	const location = getLocation(params);

	let type: QueryTypeT;
	if (hash.match(/\/menu.*/)) {
		type = 'nearestStops';
	} else if (hash.match(/#\/bikes.*/)) {
		type = 'nearestBikes';
	} else if (hash.match(/#\/stop.*/)) {
		type = 'stopDepartures';
	} else /* nearby */ {
		type = 'nearestDepartures';
	}

	return {type, location}
}

export function reducer(prevState: StateType | undefined, action: Action): StateType {
	if (prevState === undefined) {
		return {
			location: {},
			view: {
				type: 'nearestDepartures',
				data: [],
			}
		}
	}
	
	let newState;
	switch(action.type) {
	case 'HASH_CHANGE':
		const {location, type} = parseHash(
			(action.metadata as HashChangeMetadata).hash
		);

		newState = Object.assign({}, prevState, {location})
		if (prevState.view.type !== type) {
			newState.view = {
				type,
				data: [],
				loading: 'Fetching data from HSL API'
			}
		}
		break;
	case 'NEW_DATA':
		const view = action.metadata as NewDataMetadata;
		newState = Object.assign({}, prevState, {view})
		break;
	}

	return newState;
}
