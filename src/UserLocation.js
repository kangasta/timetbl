class UserLocation {
	static getUserLocation(success, error) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(success, error);
		} else {
			throw Error('Geolocation is not supported or allowed by this browser.');
		}
	}
}

export default UserLocation;
