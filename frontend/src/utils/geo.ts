export const requestGeoLocationPermission = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => resolve(), // Resolve if permission is granted
        (error) => {
        if (error.code === error.PERMISSION_DENIED) {
            console.warn("Geolocation permission denied.");
        }
        reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};

export const getGeoLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}
