import APIQuery from './../APIQuery.js';
import fetch from 'jest-fetch-mock';

describe('APIQuery', () => {
	it('queries at least name, code, platform, and location of stop', () => {
		var fields = ['name', 'code', 'platformCode', 'lat', 'lon'];
		for (var i = 0; i < fields; i++) {
			expect(APIQuery.queries.nearestDepartures()).toMatch(fields[i]);
		}
	});
	it('queries at least route, route type, destination, arrival time, departure time, real time, destination, and service day of stoptime', () => {
		var fields =
			[/trip.*{.*route.*{.*shortName.*}.*}/, /trip.*{.*route.*{.*mode.*}.*}/,
				'realtimeArrival', 'realtimeDeparture', 'realtime', 'stopHeadsign', 'serviceDay'];
		for (var i = 0; i < fields; i++) {
			expect(APIQuery.queries.nearestDepartures()).toMatch(fields[i]);
			expect(APIQuery.queries.stopDepartures()).toMatch(fields[i]);
		}
	});
	it('returns promise with expected content for nearest query', () => {
		const nearest = require('../__mocks__/NearestQueryResponse.json').data;
		fetch.mockResponse(JSON.stringify(nearest));

		APIQuery.getNearestDepartures()
		.then((responseJson) => {
			expect(responseJson).toEqual(nearest);
		});
	});
	it('returns promise with expected content for stop query', () => {
		const stop = require('../__mocks__/StopQueryResponse.json').data;
		fetch.mockResponse(JSON.stringify(stop));

		APIQuery.getStopDepartures()
		.then((responseJson) => {
			expect(responseJson).toEqual(stop);
		});
	});
});