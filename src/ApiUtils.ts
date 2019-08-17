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

export interface positionParameters {
	lat: number;
	lon: number;
	maxDistance: number;
	maxResults: number;
}

const nearestQuery = (placeType: string, placeQuery: string, {lat, lon, maxDistance, maxResults}: positionParameters): string => `
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

const nearestBikesQuery = (parameters: positionParameters): string => nearestQuery(
	'BICYCLE_RENT',
	`... on BikeRentalStation {
		stationId
		name
		bikesAvailable
		spacesAvailable
		realtime
	}`,
	parameters);


const nearestDeparturesQuery = (parameters: positionParameters): string => nearestQuery(
	'DEPARTURE_ROW',
	`... on DepartureRow {
		stop {
			${stopQuery}
		} stoptimes (
			numberOfDepartures: 3,
			omitNonPickups: true
		) {
			${stoptimesQuery}
		}
	}`,
	parameters
);

const nearestStopsQuery = (parameters: positionParameters): string => nearestQuery(
	'STOP',
	`... on Stop {
		name
		code
	}`,
	parameters
);

const stopDeparturesQuery = (stopCode: string) => `
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

export {
	nearestBikesQuery,
	nearestDeparturesQuery,
	nearestStopsQuery,
	stopDeparturesQuery,
};