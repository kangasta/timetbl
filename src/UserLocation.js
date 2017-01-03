class UserLocation {
	static getUserLocation(success, error) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(success, error);
		} else {
			throw Error('Geolocation is not supported or allowed by this browser.');
		}
	}

	static waitingForUserLocation = 'Waiting for user location data from browser. You might need to grant rights for this app to access your location data if you haven\'t already.';
}

export default UserLocation;
