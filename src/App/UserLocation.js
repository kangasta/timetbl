class UserLocation {
	static getUserLocation(success, error) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(success, error);
		} else {
			error('Geolocation is not supported or allowed by this browser.');
		}
	}
}

export default UserLocation;
