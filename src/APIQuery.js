//import fetch from 'react';

var APIurl = "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql"
// eslint-disable-next-line
var query = "{ \
  nearest (lat: 60.1836474999998, lon: 24.828072999999993, maxDistance: 150, filterByPlaceTypes: DEPARTURE_ROW) { \
    edges { \
      node { \
        place { \
          ... on DepartureRow { \
            stop { \
              name \
              code \
              platformCode \
              desc \
              lat \
              lon \
            } \
            stoptimes { \
              trip { \
                route { \
                  shortName \
                  mode \
                  alerts { \
                    alertHeaderText \
                    alertDescriptionText \
                  } \
                } \
              } \
              realtimeArrival \
              realtimeDeparture \
              realtime \
              stopHeadsign \
            } \
          } \
        } \
      } \
    } \
  } \
}" 

var getNearestDepartures = function() {
	//console.log(query)
	return fetch(APIurl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/graphql'
		},
		body: query
	})
	.then((response) => response.json()) // console.log("Status: " + response.status); 
	.then((responseJson) => { return responseJson.data; }) //console.log("JSON: " + JSON.stringify(responseJson));
	.catch((error) => { console.error(error); });
};

export {getNearestDepartures};