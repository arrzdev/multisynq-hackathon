import CreatePost from "@components/CreatePost";
import Post from "@components/Post";
import useCustomStateTogether from "@hooks/useCustomStateTogether"
import { getUserData } from "@utils/auth"
import { useEffect, useState } from "react"

const Home = () => {
  const {username, id} = getUserData();
  const [userEvents, setEvents, eventsPerUser] = useCustomStateTogether("glot-events-channel", [], id as string, true)
  const [posts, setPosts] = useState<Post[]>([]);

  //every time the events change parse the data according to the rules
  useEffect(() => {
    const allEvents = Object.values(eventsPerUser).flat();
    const posts = allEvents.filter(e => e.type === "post");

    // for each post, find the children events and add them to the post
    posts.forEach(post => {
      post.childrenEvents = allEvents.filter(e => e.type !== "post" && e.postId === post.eventId);
    });

    setPosts(posts);
  }, [eventsPerUser])

  // setEvents([]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 space-y-4">
      <div className="flex flex-col items-center space-y-4 w-96">
        <CreatePost {...{userEvents, setEvents}} />
        <div className="flex flex-col items-center space-y-1 w-full">
          {/* {JSON.stringify(eventsPerUser)} */}
          {posts.map(post => (
            <Post key={post.eventId} {...{postData:post, userEvents, setEvents}}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home;
