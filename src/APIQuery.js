class APIQuery {
	static getNearestDepartures(lat = 60.1836474999998, lon = 24.828072999999993, maxDistance = 150, maxResults=20) {
		lat = Array.isArray(lat) ? lat : [lat];
		lon = Array.isArray(lon) ? lon : [lon];
		maxDistance = Array.isArray(maxDistance) ? maxDistance : [maxDistance];
		var promises = [];
		for (var i = 0; i < Math.max(lat.length, lon.length, maxDistance.length); i++) {
			promises.push(fetch(APIQuery.APIurl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/graphql'
				},
				body: APIQuery.queries.nearestDepartures(
					lat[i >= lat.length ? lat.length -1 : i],
					lon[i >= lon.length ? lon.length -1 : i],
					maxDistance[i >= maxDistance.length ? maxDistance.length -1 : i],
					maxResults)
			})
				.then((response) => response.json())
				.then((responseJson) => {
					if (responseJson.hasOwnProperty('errors')){
						throw new Error('HSL API returned object with errors content instead of data:\n' + JSON.stringify(responseJson, null, 2));
					}
					return responseJson.data;
				})
			);
		}
		return promises;
	}

	static getStopDepartures(stopCode = 'E2036', numberOfDepartures = 10) {
		stopCode = Array.isArray(stopCode) ? stopCode : [stopCode];
		var promises = [];
		stopCode.forEach(code => {
			promises.push(
				fetch(APIQuery.APIurl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/graphql'
					},
					body: APIQuery.queries.stopDepartures(code, numberOfDepartures)
				})
					.then((response) => response.json())
					.then((responseJson) => {
						if (responseJson.hasOwnProperty('errors')){
							throw new Error('HSL API returned object with errors content instead of data\n:' + JSON.stringify(responseJson, null, 2));
						}
						return responseJson.data;
					}));
		});
		return promises;
	}

	static get EmptyNearestQueryResponse() { return {data: {nearest: {edges: [] }}}; }

	static get APIurl() { return 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'; }

	static get queryFields() { return {
		stoptimes: 'stop { name code platformCode desc lat lon } trip { route { shortName mode alerts { alertHeaderText alertDescriptionText } } } realtimeArrival realtimeDeparture realtime scheduledArrival scheduledDeparture headsign serviceDay',
		stop: 'name code platformCode desc lat lon'
	}; }

	static get queries() { return {
		nearestDepartures: (lat = 60.1836474999998, lon = 24.828072999999993, maxDistance = 150, maxResults=20) => {
			return '{ nearest (lat: ' + lat + ', lon: ' + lon + ', maxDistance: ' + maxDistance + ', maxResults: ' + maxResults + ', filterByPlaceTypes: DEPARTURE_ROW) { edges { node { distance place { ... on DepartureRow { stop { ' + APIQuery.queryFields.stop + ' } stoptimes (numberOfDepartures: 3, omitNonPickups: true) { ' + APIQuery.queryFields.stoptimes + ' }}}}}}}';
		},
		stopDepartures: (stopCode = 'E2036'/*, numberOfDepartures = 10*/) => {
			return '{ stops (name: "' + stopCode + '") { name gtfsId stoptimesForPatterns(numberOfDepartures: 3, omitNonPickups: true) { stoptimes { ' + APIQuery.queryFields.stoptimes + '}}}}';
		}
	}; }
}

export default APIQuery;