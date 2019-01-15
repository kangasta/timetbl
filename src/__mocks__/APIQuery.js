class APIQuery {
	static get nearestResponse() { return require('./NearestQueryResponse.json'); }
	static get stopResponse() { return require('./StopQueryResponse.json'); }
	static get nearestStopsResponse() { return require('./NearestStopsQueryResponse.json'); }
	static get invalidResponse() { return require('./InvalidQueryResponse.json'); }

	static checkResponseJSON(responseJson) {
		if (responseJson.hasOwnProperty('errors')) {
			throw Error('HSL API returned object with errors content instead of data\n:' + JSON.stringify(responseJson, null, 2));
		}
		return responseJson.data;
	}

	static getNearestDepartures(lat=0, lon=0) {
		var arr = [];
		for (var i = 0; !i || Array.isArray(lat) && i < lat.length; i++) {
			arr.push(Promise.resolve(lat == 666 || lon == 666 ?  APIQuery.invalidResponse : APIQuery.nearestResponse)
				.then(APIQuery.checkResponseJSON));
		}
		return arr;
	}

	static getStopDepartures(stopCode='E2036') {
		return [Promise.resolve(stopCode == '666' ? APIQuery.invalidResponse : APIQuery.stopResponse)
			.then(APIQuery.checkResponseJSON)
		];
	}

	static getNearestStops(lat=0, lon=0) {
		return Promise.resolve(lat == 666 || lon == 666 ? APIQuery.invalidResponse : APIQuery.nearestStopsResponse)
			.then(APIQuery.checkResponseJSON);
	}
}

export default APIQuery;
