import {  useMemo } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import type { Post } from '@utils/types';
import { setDrawerState } from '@/components/Drawer';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const MapView = ({
  geoLocation,
  posts,
  zoomLevel,
  setZoomLevel,
  setPostViewId
}: {
  geoLocation: { latitude: number, longitude: number },
  posts: Post[],
  zoomLevel: number,
  setZoomLevel: (zoomLevel: number) => void,
  setPostViewId: (id: string) => void
}) => {

  const handleZoomIn = () => {
    setZoomLevel(zoomLevel + 0.3);
  };

  const handleZoomOut = () => {
    if (zoomLevel <= 2.8) return;
    setZoomLevel(zoomLevel - 0.3);
  };

  const handleMarkerClick = (post: Post) => {
    setPostViewId(post.eventId);
    setDrawerState("post-view");
  };

  // Memoize the Map component to prevent re-rendering on every mount
  const mapComponent = useMemo(() => (
    //@ts-ignore
    <Map
      //@ts-ignore
      google={window?.google as any}
      zoom={zoomLevel}
      initialCenter={geoLocation}
      centerAroundCurrentLocation={true}
      disableDefaultUI={true} // Disables the default maps UI components
      clickableIcons={false} // Disables default click on POIs
      styles={[
        { // This style removes all default business points of interest
          featureType: "poi.business",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        },
        { // This style removes all default points of interest
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]}
    >
      {posts.map(post => (
        <Marker
          key={post.eventId}
          //@ts-ignore
          position={{ lat: post.geoLocation.latitude, lng: post.geoLocation.longitude }}
          icon={{
            //@ts-ignore
            path: window?.google?.maps?.SymbolPath?.CIRCLE,
            scale: Math.max(8, (175 / Math.pow(zoomLevel, 3.2))),
            fillColor: "#780000",
            fillOpacity: 0.8,
            strokeWeight: 1,
            strokeColor: "#FFFFFF"
          }}
          onClick={() => handleMarkerClick(post)}
        />
      ))}
    </Map>
  ), [geoLocation, posts, zoomLevel]);

  return (
    <div className="w-[102%] h-[102%] min-h-screen overflow-hidden fixed -top-1 -left-1">
      {mapComponent}

      {/* Controllers */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-10 flex flex-row items-center space-x-4">
        <button onClick={handleZoomIn} className="bg-[#780000] hover:bg-[#C1121F] text-white font-bold w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-3xl">+</button>
        <button onClick={handleZoomOut} className="bg-[#FDF0D5] hover:bg-[#fde4cf] text-[#780000] font-bold w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-3xl">-</button>
      </div>
    </div>
  )
}

export default GoogleApiWrapper({
  apiKey: API_KEY
  //@ts-ignore
})(MapView);