import APIQuery from './APIQuery.js'

describe('APIQuery.queries', () => {

    it('should query at least name, code, platform, and location of stop', () => {
        var stopFields = ["name", "code", "platformCode", "lat", "lon"];
        for (var field in stopFields) {
            expect(APIQuery.queries.nearestDepartures()).toMatch(field);
        }
    });
    it('should query at least route, route type, destination, arrival time, departure time, real time, destination, and service day of stop', () => {
        var stopFields = 
            [/trip.*{.*route.*{.*shortName.*}.*}/, /trip.*{.*route.*{.*mode.*}.*}/,
            "realtimeArrival", "realtimeDeparture", "realtime", "stopHeadsign", "serviceDay"];
        for (var field in stopFields) {
            expect(APIQuery.queries.nearestDepartures()).toMatch(field);
            expect(APIQuery.queries.stopDepartures()).toMatch(field);
        }
    });
});