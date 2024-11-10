import Drawer from "@/components/Drawer";
import Navbar from "@/components/NavBar";
import NewPost from "@/components/NewPost";
import PostView from "@/views/PostView";
import Searchbar from "@/components/SearchBar";
import type { Post } from "@/utils/types";
import useCustomStateTogether from "@/hooks/useCustomStateTogether"
import { getUserData } from "@/utils/auth"
import { getGeoLocation } from "@/utils/geo";
import MapView from "@/views/MapView";
import PostCard from "@components/PostCard";
import { useEffect, useState } from "react"
import { div } from "framer-motion/client";

const Home = () => {
  const {username, id} = getUserData();
  const [userEvents, setEvents, eventsPerUser] = useCustomStateTogether("glot-events-channel", [], id as string, true)
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchCategory, setSearchCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  //mantain user geolocation ready to be sent with each post
  const [geoLocation, setGeoLocation] = useState<{latitude: number, longitude: number, near: string} | null>(null);

  //sets the current view
  const [currentView, setCurrentView] = useState<"map" | "list">("list");

  //map states
  const [zoomLevel, setZoomLevel] = useState(15);

  const [postViewId, setPostViewId] = useState<string | null>(null);

  //on page load, fetch the user's geolocation
  useEffect(() => {
    const fetchGeoLocation = async () => {
      //get lat and long
      const location = await getGeoLocation();
      
      //get actual place
      const lookupResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`);
      const lookupData = await lookupResponse.json();
      const near = lookupData.results[0]["address_components"][3]["short_name"];

      //set the geo location
      setGeoLocation({latitude: location.coords.latitude, longitude: location.coords.longitude, near });
    }

    fetchGeoLocation();
  }, [])

  //every time the events change parse the data according to the rules
  useEffect(() => {
    const allEvents = Object.values(eventsPerUser).flat();
    const posts = allEvents.filter(e => e.type === "post");

    //filter based on search query
    const filteredPosts = posts.filter(post => (post.userData.username.toLowerCase().includes(searchQuery.toLowerCase()) || post.text.toLowerCase().includes(searchQuery.toLowerCase())) && (post.category === searchCategory.toLowerCase() || searchCategory === "All"));

    // for each post, find the children events and add them to the post
    filteredPosts.forEach(post => {
      post.childrenEvents = allEvents.filter(e => e.type !== "post" && e.postId === post.eventId);
    });

    setPosts(filteredPosts);
  }, [eventsPerUser, searchQuery, searchCategory])

  return (
    <div className="flex flex-col h-full bg-[#fdf0d5]"> 
      <Drawer views={{
        "new-post": <NewPost {...{setEvents, userEvents, geoLocation}}/>,
        "post-view": <PostView {...{postData: posts.find(p => p.eventId === postViewId), userEvents, setEvents}}/>
        }}/>
      <Navbar setCurrentView={setCurrentView} />
      <div className="px-4 pt-2 pb-24">
        <Searchbar {...{searchCategory, setSearchCategory, searchQuery, setSearchQuery}} />
        <div className="flex-grow relative">
        {currentView === "list" ? (
          <div className="flex flex-col space-y-4 mt-4">
            {posts.map(post => (
              <PostCard key={post.eventId} {...{postData: post, userEvents, setEvents, setPostViewId}}/>
            ))}
          </div>
        ) : (
          <MapView {...{geoLocation, posts, zoomLevel, setZoomLevel, setPostViewId}} />
        )}
        </div>
      </div>
    </div>
  )
}

export default Home;
