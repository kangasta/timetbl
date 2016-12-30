import APIQuery from './APIQuery.js';

describe('APIQuery.queries', () => {
	it('should query at least name, code, platform, and location of stop', () => {
		var fields = ['name', 'code', 'platformCode', 'lat', 'lon'];
		for (var i = 0; i < fields; i++) {
			expect(APIQuery.queries.nearestDepartures()).toMatch(fields[i]);
		}
	});
	it('should query at least route, route type, destination, arrival time, departure time, real time, destination, and service day of stoptime', () => {
		var fields =
			[/trip.*{.*route.*{.*shortName.*}.*}/, /trip.*{.*route.*{.*mode.*}.*}/,
			'realtimeArrival', 'realtimeDeparture', 'realtime', 'stopHeadsign', 'serviceDay'];
		for (var i = 0; i < fields; i++) {
			expect(APIQuery.queries.nearestDepartures()).toMatch(fields[i]);
			expect(APIQuery.queries.stopDepartures()).toMatch(fields[i]);
		}
	});
});