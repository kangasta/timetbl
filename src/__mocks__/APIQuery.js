class APIQuery {
	static getNearestDepartures() {
		return new Promise((resolve) => {
			resolve(require('../__mocks__/NearestQueryResponse.json').data);
		});
	}

	static getStopDepartures() {
		return new Promise((resolve) => {
			resolve(require('../__mocks__/StopQueryResponse.json').data);
		});
	}
}

export default APIQuery;
