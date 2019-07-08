import { APIQuery } from '../timetbl';

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
	it('returns promise with expected content for queries', () => {
		var promises = [];
		[
			{
				json: require('../__mocks__/NearestQueryResponse.json'),
				fn: APIQuery.getNearestDepartures
			},
			{
				json: require('../__mocks__/StopQueryResponse.json'),
				fn: APIQuery.getStopDepartures
			}
		].map(query => {
			global.fetch = jest.fn() // eslint-disable-line
				.mockReturnValue(new Promise((resolve) => { resolve({json: () => query.json}); }));

			promises.push(Promise.all(query.fn())
				.then((responseJson) => {
					expect(responseJson[0]).toEqual(query.json.data);
				}));
		});

		return Promise.all(promises);
	});
	it('returns rejected promise with invalid response', () => {
		const invalid = require('../__mocks__/InvalidQueryResponse.json');
		global.fetch = jest.fn() // eslint-disable-line
			.mockReturnValue(new Promise((resolve) => {resolve({json: () => invalid});}));
		return Promise.all(APIQuery.getStopDepartures().concat(APIQuery.getNearestDepartures()))
			.catch((errorJsonString) => {
				expect(errorJsonString.toString()).toMatch(/[Ee]rror/);
			});
	});
});
