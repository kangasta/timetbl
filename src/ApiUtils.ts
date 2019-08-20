import { string } from 'prop-types';

const stopQuery = `
	gtfsId
	name
	code
	platformCode
	desc
	lat
	lon`;

const stoptimesQuery = `
	stop {
		${stopQuery}
	} trip {
		gtfsId
		route {
			shortName
			mode
			alerts {
				alertDescriptionTextTranslations {
					text
					language
				}
				alertSeverityLevel
				alertEffect
				alertCause
			}
		}
	}
	realtimeArrival
	realtimeDeparture
	realtime
	scheduledArrival
	scheduledDeparture
	headsign
	serviceDay`;

const apiUrl = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';

export interface PositionParameters {
	lat: number;
	lon: number;
	maxDistance: number;
	maxResults: number;
}

export interface StopParameters {
	stopCode: string;
}

const nearestQuery = (placeType: string, placeQuery: string, {lat, lon, maxDistance, maxResults}: PositionParameters): string => `
	{ nearest(
		lat: ${lat},
		lon: ${lon},
		maxDistance: ${maxDistance},
		maxResults: ${maxResults},
		filterByPlaceTypes: ${placeType}
	) {
		edges {
			node {
				distance
				place {
					${placeQuery}
				}
			}
		}
	}}`;

const nearestBikesQuery = (parameters: PositionParameters): string => nearestQuery(
	'BICYCLE_RENT',
	`... on BikeRentalStation {
		stationId
		name
		bikesAvailable
		spacesAvailable
		realtime
	}`,
	parameters);


const nearestDeparturesQuery = (parameters: PositionParameters): string => nearestQuery(
	'DEPARTURE_ROW',
	`... on DepartureRow {
		stoptimes (
			numberOfDepartures: 3,
			omitNonPickups: true
		) {
			${stoptimesQuery}
		}
	}`,
	parameters
);

const nearestStopsQuery = (parameters: PositionParameters): string => nearestQuery(
	'STOP',
	`... on Stop {
		${stopQuery}
	}`,
	parameters
);

const stopDeparturesQuery = ({stopCode}: StopParameters) => `
	{ stops (
		name: "${stopCode}"
	) {
		name
		gtfsId
		stoptimesForPatterns(
			numberOfDepartures: 3,
			omitNonPickups: true
		) {
			stoptimes {
				${stoptimesQuery}
			}
		}
	}}`;

export interface NearestNode <Place>{
	node: {
		distance: number;
		place: Place;
	};
}

export interface NearestData <Place>{
	nearest: {
		edges: NearestNode<Place>[];
	};
}

export interface BikeStation {
	stationId: string;
	name: string;
	bikesAvailable: number;
	spacesAvailable: number;
	realtime: boolean;
}

export type AlertSeverity = 'UNKNOWN_SEVERITY' | 'INFO' | 'WARNING' | 'SEVERE';
export type AlertEffect = 'NO_SERVICE' | 'REDUCED_SERVICE' | 'SIGNIFICANT_DELAYS' | 'DETOUR' | 'ADDITIONAL_SERVICE' | 'MODIFIED_SERVICE' | 'OTHER_EFFECT' | 'UNKNOWN_EFFECT' | 'STOP_MOVED' | 'NO_EFFECT';
export interface RouteAlert {
	alertDescriptionTextTranslations: {
		text: string;
		language: string;
	}[];
	alertSeverityLevel: AlertSeverity;
	alertEffect: AlertEffect;
	alertCause: string;
}

export type TransportMode = 'AIRPLANE' | 'BICYCLE' | 'BUS' | 'CABLE_CAR' | 'CAR' | 'FERRY' | 'FUNICULAR' | 'GONDOLA' | 'RAIL' | 'SUBWAY' | 'TRAM' | 'TRANSIT' | 'WALK';

export interface TransportRoute {
	shortName: string;
	mode: TransportMode;
	alerts: RouteAlert[];
}

export interface Stop {
	gtfsId: string;
	name: string;
	code: string;
	platformCode: string;
	desc: string;
	lat: number;
	lon: number;
}

export interface StoptimeData {
	stop: Stop;
	trip: {
		gtfsId: string;
		route: TransportRoute;
	};
	realtimeArrival: number;
	realtimeDeparture: number;
	realtime: boolean;
	scheduledArrival: number;
	scheduledDeparture: number;
	headsign: string;
	serviceDay: number;
}

export interface StoptimesData {
	stoptimes: StoptimeData[];
}

export interface StopData {
	stops: StoptimesData[];
}

const combineNearestData = <Place>(data: NearestData<Place>[]) => {
	return data.reduce((r,i) => {
		r = r.concat(i.nearest.edges); return r;
	}, []);
};

const combineStopsData = (data: StopData[]) => {
	return data.reduce((r, i) => {
		r = r.concat(i.stops);
		return r;
	}, []).reduce((r,i) => {
		r = r.concat(i.stoptimesForPatterns);
		return r;
	}, []);
};

type StoptimesSortable = StoptimesData | NearestNode<StoptimesData>;
const sortStoptimesData = (data: StoptimesSortable[], isNearestNode: boolean): StoptimesSortable[] => {
	const getStoptimes = (item: StoptimesSortable): StoptimeData[] => (isNearestNode ? (item as NearestNode<StoptimesData>).node.place.stoptimes : (item as StoptimesData).stoptimes);

	return data.filter(
		(item: StoptimesSortable): boolean => (getStoptimes(item).length > 0)
	).sort(
		(a: StoptimesSortable, b: StoptimesSortable): number => {
			const a0 = getStoptimes(a)[0];
			const b0 = getStoptimes(b)[0];

			return (a0.serviceDay - b0.serviceDay) ?
						(a0.serviceDay - b0.serviceDay) :
						(a0.realtimeDeparture - b0.realtimeDeparture);
		}
	);
};

export type QueryTypeT = 'nearestBikes' | 'nearestDepartures' | 'nearestStops' | 'stopDepartures';
type QueryParametersT = PositionParameters | StopParameters;

export async function sendQuery(type: QueryTypeT, parameters: QueryParametersT | QueryParametersT[]): Promise<object[]> {
	parameters = Array.isArray(parameters) ? parameters : [parameters];

	let queryGetter: (parameters: PositionParameters | StopParameters) => string;
	switch(type) {
		case 'nearestBikes':
			queryGetter = nearestBikesQuery;
			break;
		case 'nearestDepartures':
			queryGetter = nearestDeparturesQuery;
			break;
		case 'nearestStops':
			queryGetter = nearestStopsQuery;
			break;
		case 'stopDepartures':
			queryGetter = stopDeparturesQuery;
			break;
	}

	const promises = parameters.map(async (parametersItem): Promise<object> => {
		const data = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/graphql'
			},
			body: queryGetter(parametersItem)
		});

		const jsonData = await data.json();
		if (jsonData.hasOwnProperty('errors')) {
			throw new Error('HSL API returned object with errors content instead of data:\n' + JSON.stringify(jsonData.errors, null, 2));
		}

		return jsonData.data;
	});
	const promise = await Promise.all(promises);

	switch(type) {
	case 'nearestBikes':
	case 'nearestStops':
		return combineNearestData(promise as NearestData<unknown>[]);
	case 'nearestDepartures':
		return sortStoptimesData(
			combineNearestData(promise as NearestData<unknown>[]),
			true
		);
	case 'stopDepartures':
		return sortStoptimesData(
			combineStopsData(promise as StopData[]),
			false
		);
	}
}

export {
	nearestBikesQuery,
	nearestDeparturesQuery,
	nearestStopsQuery,
	stopDeparturesQuery,
};