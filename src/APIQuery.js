class APIQuery {
	static getNearestDepartures(lat = 60.1836474999998, lon = 24.828072999999993, maxDistance = 150) {
		return fetch(APIQuery.APIurl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/graphql'
			},
			body: APIQuery.queries.nearestDepartures(lat, lon, maxDistance)
		})
		.then((response) => response.json()) // console.log('Status: ' + response.status);
		.then((responseJson) => { return responseJson.data; }); //console.log(JSON.stringify(responseJson, null, 2));
		//.catch((error) => { console.error(error); });
	}

	static getStopDepartures(stopCode = 'E2036', numberOfDepartures = 10) {
		return fetch(APIQuery.APIurl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/graphql'
			},
			body: APIQuery.queries.stopDepartures(stopCode, numberOfDepartures)
		})
		.then((response) => response.json()) // console.log('Status: ' + response.status);
		.then((responseJson) => { return responseJson.data; }); //console.log(JSON.stringify(responseJson, null, 2));
		//.catch((error) => { console.error(error); });
	}

	static APIurl = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
	static queryFields = {
		stoptimes: 'trip { route { shortName mode alerts { alertHeaderText alertDescriptionText } } } realtimeArrival realtimeDeparture realtime stopHeadsign serviceDay',
		stop: 'name code platformCode desc lat lon'
	};
	static queries = {
		nearestDepartures: (lat = 60.1836474999998, lon = 24.828072999999993, maxDistance = 150) => {
			return '{ nearest (lat: ' + lat + ', lon: ' + lon + ', maxDistance: ' + maxDistance + ', filterByPlaceTypes: DEPARTURE_ROW) { edges { node { place { ... on DepartureRow { stop { ' + APIQuery.queryFields.stop + ' } stoptimes { ' + APIQuery.queryFields.stoptimes + ' }}}}}}}';
		},
		stopDepartures: (stopCode = 'E2036', numberOfDepartures = 10) => {
			return '{ stops(name: \'' + stopCode + '\') { name gtfsId stoptimesWithoutPatterns(numberOfDepartures: ' + numberOfDepartures + ') { ' + APIQuery.queryFields.stoptimes + '}}}';
		}
	};
}

export default APIQuery;