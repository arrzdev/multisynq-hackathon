import { useState } from 'react'
import { getUserData } from '@/utils/auth';
import { getGeoLocation } from '@/utils/geo';

const CreatePost = ({
  userEvents,
  setEvents
}) => {
  const {username, id} = getUserData();

  const [postText, setPostText] = useState("");
  const [postFiles, setPostFiles] = useState<Buffer[] | null>([]);
  const [audioFile, setAudioFile] = useState<Buffer | null>(null);
  const [pollOptions, setPollOptions] = useState<string[]>([]);

  // HANDLERS
  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handlePollOptionChange = (e, index) => {
    const newPollOptions = [...pollOptions];
    newPollOptions[index] = e.target.value;
    setPollOptions(newPollOptions);
  };

  const addPollOption = () => {
    if (postFiles.length === 0 && !audioFile) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const handleSubmit = () => {
    var attachments = {};
    if (postFiles.length > 0) {
      attachments = { type: "media", data: postFiles };
    } else if (audioFile) {
      attachments = { type: "audio", data: audioFile };
    } else if (pollOptions.length > 0) {
      attachments = { type: "poll", data: pollOptions.filter(option => option.trim() !== "") };
    }

    sendPostEvent(postText, attachments);

    //cleanup
    setPostText("");
    setPostFiles([]);
    setAudioFile(null);
    setPollOptions([]);
  };

  //EVENT SUBMISSIONS
  const sendPostEvent = async (text: string, attachments: any) => {
    const newPostEvent = {
      type: "post",
      eventId: Math.random().toString(36).substr(2, 8),
      userData: {username, id},
      text: text,
      attachments: attachments
    }

    //grab user geo location
    const geoLocation = await getGeoLocation();
    console.log("GEOLOCATION", geoLocation);

    //send the event to the server
    setEvents([newPostEvent,...userEvents]);
  }

  return (
    <div className="mt-4 p-4 bg-white shadow-lg rounded-lg w-full max-w-md">
        <p className="text-xl font-semibold text-gray-800 mb-4">Create Post</p>
        <textarea 
          placeholder="What's on your mind?" 
          value={postText} 
          onChange={handleTextChange} 
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
        {pollOptions.map((option, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handlePollOptionChange(e, index)}
            className={`w-full p-3 border border-gray-300 rounded-lg mb-4 ${postFiles.length > 0 || audioFile !== null ? "bg-gray-200 cursor-not-allowed" : ""}`}
            disabled={postFiles.length > 0 || audioFile !== null}
          />
        ))}
        <button onClick={addPollOption} className={`w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors mb-4 ${postFiles.length > 0 || audioFile !== null ? "bg-green-300 cursor-not-allowed" : ""}`} disabled={postFiles.length > 0 || audioFile !== null}>
          Add Poll Option
        </button>
        <button 
          onClick={handleSubmit} 
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Post
        </button>
        {/* render-posts */}
      </div>
  )
}

export default CreatePost