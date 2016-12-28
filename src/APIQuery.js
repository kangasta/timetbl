//import fetch from 'react';

var APIurl = "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql"
var queryFields = {
  "stoptimes": "trip { route { shortName mode alerts { alertHeaderText alertDescriptionText } } } realtimeArrival realtimeDeparture realtime stopHeadsign serviceDay",
  "stop": "name code platformCode desc lat lon"
};
var queries = {
  "nearestDepartures": function (lat = 60.1836474999998, lon = 24.828072999999993, maxDistance =  150) {
    return "{ nearest (lat: " + lat + ", lon: " + lon + ", maxDistance: " + maxDistance + ", filterByPlaceTypes: DEPARTURE_ROW) { edges { node { place { ... on DepartureRow { stop { " + queryFields.stop + " } stoptimes { " + queryFields.stoptimes + " }}}}}}}" 
  }
};

var getNearestDepartures = function() {
	//console.log(query)
	return fetch(APIurl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/graphql'
		},
		body: queries.nearestDepartures()
	})
	.then((response) => response.json()) // console.log("Status: " + response.status); 
	.then((responseJson) => { return responseJson.data; }) //console.log("JSON: " + JSON.stringify(responseJson));
	.catch((error) => { console.error(error); });
};

export {getNearestDepartures};