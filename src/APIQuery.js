import {
	nearestBikesQuery,
	nearestDeparturesQuery,
	stopDeparturesQuery,
	nearestStopsQuery,
} from './ApiUtils.ts';

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

class APIQuery {
	static getNearestBikes(lat = 60.1836474999998, lon = 24.828072999999993, maxDistance = 2500) {
		lat = Array.isArray(lat) ? lat : [lat];
		lon = Array.isArray(lon) ? lon : [lon];
		maxDistance = Array.isArray(maxDistance) ? maxDistance : [maxDistance];
		const promises = [];
		for (let i = 0; i < Math.max(lat.length, lon.length, maxDistance.length); i++) {
			promises.push(sendQuery(nearestBikesQuery({
				lat: (i >= lat.length ? lat.length -1 : i),
				lon: (i >= lon.length ? lon.length -1 : i),
				maxDistance: (i >= maxDistance.length ? maxDistance.length -1 : i)
			})));
		}
		return promises;
	}

	static getNearestDepartures(lat = 60.1836474999998, lon = 24.828072999999993, maxDistance = 150, maxResults=20) {
		lat = Array.isArray(lat) ? lat : [lat];
		lon = Array.isArray(lon) ? lon : [lon];
		maxDistance = Array.isArray(maxDistance) ? maxDistance : [maxDistance];
		const promises = [];
		for (let i = 0; i < Math.max(lat.length, lon.length, maxDistance.length); i++) {
			promises.push(sendQuery(nearestDeparturesQuery({
				lat: (i >= lat.length ? lat.length -1 : i),
				lon: (i >= lon.length ? lon.length -1 : i),
				maxDistance: (i >= maxDistance.length ? maxDistance.length -1 : i),
				maxResults
			})));
		}
		return promises;
	}

	static getStopDepartures(stopCode = 'E2036', numberOfDepartures = 10) {
		stopCode = Array.isArray(stopCode) ? stopCode : [stopCode];
		const promises = [];
		stopCode.forEach(code => {
			promises.push(sendQuery(stopDeparturesQuery({stopCode: code})));
		});
		return promises;
	}

	static getNearestStops(lat = 60.1836474999998, lon = 24.828072999999993, maxDistance = 150, maxResults=20) {
		return sendQuery(nearestStopsQuery({lat, lon, maxDistance, maxResults}));
	}

	static get EmptyNearestQueryResponse() { return {data: {nearest: {edges: [] }}}; }

	static get APIurl() { return 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'; }
}

export default APIQuery;