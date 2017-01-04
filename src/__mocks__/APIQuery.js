class APIQuery {
	static nearestResponse = require('./NearestQueryResponse.json');
	static stopResponse = require('./StopQueryResponse.json');
	static invalidResponse = require('./InvalidQueryResponse.json');

	static getNearestDepartures(lat=0, lon=0) {
		return Promise.resolve(lat == 666 || lon == 666 ?  APIQuery.invalidResponse : APIQuery.nearestResponse)
		.then((responseJson) => {
			if (responseJson.hasOwnProperty('errors')){
				throw Error('HSL API returned object with errors content instead of data\n:' + JSON.stringify(responseJson, null, 2));
			}
			return responseJson.data;
		});
		/*return new Promise((resolve, reject) => {
			const responseJson = lat == 666 || lon == 666 ?  APIQuery.invalidResponse : APIQuery.nearestResponse;
			if (responseJson.hasOwnProperty('errors')){
				return reject('HSL API returned object with errors content instead of data\n:' + JSON.stringify(responseJson, null, 2));
			}
			return resolve(responseJson.data);
		});*/
	}

	static getStopDepartures(stopCode='E2036') {
		return Promise.resolve(stopCode == '666' ?  APIQuery.invalidResponse : APIQuery.stopResponse)
		.then((responseJson) => {
			if (responseJson.hasOwnProperty('errors')){
				throw Error('HSL API returned object with errors content instead of data\n:' + JSON.stringify(responseJson, null, 2));
			}
			return responseJson.data;
		});
		/*return new Promise((resolve, reject) => {
			const responseJson = stopCode == '666' ?  APIQuery.invalidResponse : APIQuery.stopResponse;
			if (responseJson.hasOwnProperty('errors')){
				return reject('HSL API returned object with errors content instead of data\n:' + JSON.stringify(responseJson, null, 2));
			}
			resolve(responseJson.data);
		});*/
	}
}

export default APIQuery;
