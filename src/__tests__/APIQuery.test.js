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

		Promise.all(APIQuery.getNearestDepartures())
		.then((responseJson) => {
			expect(responseJson).toEqual(nearest);
		});
	});
	it('returns promise with expected content for stop query', () => {
		const stop = require('../__mocks__/StopQueryResponse.json').data;
		fetch.mockResponse(JSON.stringify(stop));

		Promise.all(APIQuery.getStopDepartures())
		.then((responseJson) => {
			expect(responseJson).toEqual(stop);
		});
	});
	it('returns rejected promise with invalid response', () => {
		const invalid = require('../__mocks__/InvalidQueryResponse.json').data;
		fetch.mockResponse(JSON.stringify(invalid));

		Promise.all(APIQuery.getStopDepartures())
		.catch((errorJsonString) => {
			expect(errorJsonString).toMatch(/{\s*error\s*:\s*{/);
		});
	});
});