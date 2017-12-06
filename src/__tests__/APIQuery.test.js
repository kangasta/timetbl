import APIQuery from './../APIQuery.js';

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
		const nearest = require('../__mocks__/NearestQueryResponse.json');
		fetch = jest.fn() // eslint-disable-line
			.mockReturnValue(new Promise((resolve) => {resolve({json: () => nearest});}));

		return Promise.all(APIQuery.getNearestDepartures())
			.then((responseJson) => {
				expect(responseJson[0]).toEqual(nearest.data);
			});
	});
	it('returns promise with expected content for stop query', () => {
		const stop = require('../__mocks__/StopQueryResponse.json');
		fetch = jest.fn() // eslint-disable-line
			.mockReturnValue(new Promise((resolve) => {resolve({json: () => stop});}));

		return Promise.all(APIQuery.getStopDepartures())
			.then((responseJson) => {
				expect(responseJson[0]).toEqual(stop.data);
			});
	});
	it('returns rejected promise with invalid response', () => {
		const invalid = require('../__mocks__/InvalidQueryResponse.json');
		fetch = jest.fn() // eslint-disable-line
			.mockReturnValue(new Promise((resolve) => {resolve({json: () => invalid});}));
		return Promise.all(APIQuery.getStopDepartures().concat(APIQuery.getNearestDepartures()))
			.catch((errorJsonString) => {
				expect(errorJsonString.toString()).toMatch(/[Ee]rror/);
			});
	});
});