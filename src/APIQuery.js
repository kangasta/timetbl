const sendQuery = body => {
	return fetch(APIQuery.APIurl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/graphql'
		},
		body: body
	})
		.then((response) => response.json())
		.then((responseJson) => {
			if (responseJson.hasOwnProperty('errors')){
				throw new Error('HSL API returned object with errors content instead of data:\n' + JSON.stringify(responseJson, null, 2));
			}
			return responseJson.data;
		});
};

const queryFields = {
	stoptimes: 'stop { name code platformCode desc lat lon } trip { route { shortName mode alerts { alertDescriptionTextTranslations { text language } } } } realtimeArrival realtimeDeparture realtime scheduledArrival scheduledDeparture headsign serviceDay',
	stop: 'name code platformCode desc lat lon'
};

const queries = {
	nearestBikes: (lat = 60.1836474999998, lon = 24.828072999999993, maxDistance = 2500) => '{nearest(lat: ' + lat.toString() + ', lon: ' + lon.toString() + ', maxDistance: ' + maxDistance.toString() + ', filterByPlaceTypes:BICYCLE_RENT) { edges { node { place { ... on BikeRentalStation { stationId name bikesAvailable spacesAvailable realtime } } distance } } } }',
	nearestDepartures: (lat = 60.1836474999998, lon = 24.828072999999993, maxDistance = 150, maxResults=20) => '{ nearest (lat: ' + lat + ', lon: ' + lon + ', maxDistance: ' + maxDistance + ', maxResults: ' + maxResults + ', filterByPlaceTypes: DEPARTURE_ROW) { edges { node { distance place { ... on DepartureRow { stop { ' + queryFields.stop + ' } stoptimes (numberOfDepartures: 3, omitNonPickups: true) { ' + queryFields.stoptimes + ' }}}}}}}',
	stopDepartures: (stopCode = 'E2036'/*, numberOfDepartures = 10*/) => '{ stops (name: "' + stopCode + '") { name gtfsId stoptimesForPatterns(numberOfDepartures: 3, omitNonPickups: true) { stoptimes { ' + queryFields.stoptimes + '}}}}',
	nearestStops: (lat = 60.1836474999998, lon = 24.828072999999993, maxDistance = 150, maxResults=20) => '{ nearest(lat: ' + lat + ', lon: ' + lon + ', maxDistance: ' + maxDistance + ', maxResults: ' + maxResults + ', filterByPlaceTypes: STOP) { edges { node { place { ... on Stop { name code }}}}}}'
};

class APIQuery {
	static getNearestBikes(lat = 60.1836474999998, lon = 24.828072999999993, maxDistance = 2500) {
		lat = Array.isArray(lat) ? lat : [lat];
		lon = Array.isArray(lon) ? lon : [lon];
		maxDistance = Array.isArray(maxDistance) ? maxDistance : [maxDistance];
		var promises = [];
		for (var i = 0; i < Math.max(lat.length, lon.length, maxDistance.length); i++) {
			promises.push(sendQuery(queries.nearestBikes(
				lat[i >= lat.length ? lat.length -1 : i],
				lon[i >= lon.length ? lon.length -1 : i],
				maxDistance[i >= maxDistance.length ? maxDistance.length -1 : i])
			));
		}
		return promises;
	}

	static getNearestDepartures(lat = 60.1836474999998, lon = 24.828072999999993, maxDistance = 150, maxResults=20) {
		lat = Array.isArray(lat) ? lat : [lat];
		lon = Array.isArray(lon) ? lon : [lon];
		maxDistance = Array.isArray(maxDistance) ? maxDistance : [maxDistance];
		var promises = [];
		for (var i = 0; i < Math.max(lat.length, lon.length, maxDistance.length); i++) {
			promises.push(sendQuery(queries.nearestDepartures(
				lat[i >= lat.length ? lat.length -1 : i],
				lon[i >= lon.length ? lon.length -1 : i],
				maxDistance[i >= maxDistance.length ? maxDistance.length -1 : i],
				maxResults)
			));
		}
		return promises;
	}

	static getStopDepartures(stopCode = 'E2036', numberOfDepartures = 10) {
		stopCode = Array.isArray(stopCode) ? stopCode : [stopCode];
		var promises = [];
		stopCode.forEach(code => {
			promises.push(sendQuery(queries.stopDepartures(code, numberOfDepartures)));
		});
		return promises;
	}

	static getNearestStops(lat = 60.1836474999998, lon = 24.828072999999993, maxDistance = 150, maxResults=20) {
		return sendQuery(queries.nearestStops(lat, lon, maxDistance, maxResults));
	}

	static get EmptyNearestQueryResponse() { return {data: {nearest: {edges: [] }}}; }

	static get APIurl() { return 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'; }
}

export default APIQuery;