import { requestGeoLocationPermission } from '@utils/geo';

const handleRequestGeoLocationPermission = async () => {
  try {
    await requestGeoLocationPermission();
    window.location.reload(); // Reload the page to reflect the new permission status
  } catch (err) {
    console.error("Error requesting geolocation permission", err);
    alert("Failed to obtain geolocation permission. Please enable it in your browser settings.");
  }
}

const GeoLocationImposer = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-black space-y-2">
      <div className="text-3xl font-bold text-white">Oh no! Geo location is not available</div>
      <div className="text-white">Please enable geolocation in your browser</div>
      <button onClick={handleRequestGeoLocationPermission} className="text-white underline">Click here to enable it!</button>
    </div>
  )
}

export default GeoLocationImposer