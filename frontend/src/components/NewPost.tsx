import React, { useState, useRef, useEffect } from 'react';

import { BiMicrophone, BiPause, BiPlay, BiSolidImageAdd } from "react-icons/bi";
import { IoList, IoPauseOutline, IoPlayOutline } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { getUserData } from '@/utils/auth';
import { setDrawerState } from '@/components/Drawer';

const NewEvent = ({
  setEvents,
  userEvents,
  geoLocation
}) => {
  //get user data
  const {username, id} = getUserData();

  // Images useStates
  const [images, setImages] = useState([]);

  // Category useStates
  const [category, setCategory] = useState("");

  // Audio useStates
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); 
  const audioRef = useRef<HTMLAudioElement>(null);

  // Poll useStates
  const [pollOptions, setPollOptions] = useState<string[]>([]);

  // NewPost useStates
  const [newPost, setNewPost] = useState({
    text: "",
    attachments: null,
  });

  // Handle new post submission
  const handleSubmit = () => {
    var attachments = {};
    // if (images.length > 0) {
    //   attachments = { type: "media", data: images };
    // } else if (audioUrl) {
    //   attachments = { type: "audio", data: audioFile };
    if (pollOptions.length > 0) {
      attachments = { type: "poll", data: pollOptions.filter(option => option.trim() !== "") };
    }

    const newPostEvent = {
      type: "post",
      eventId: Math.random().toString(36).substr(2, 8),
      userData: {username, id},
      text: newPost.text,
      category: category.toLowerCase(),
      attachments: attachments,
      geoLocation: geoLocation
    }

    //send the event to the server
    setEvents([newPostEvent,...userEvents]);

    //Close the drawer
    setDrawerState(null);

    //cleanup
    setNewPost({text: "", attachments: null});
    setImages([]);
    setAudioUrl(null);
    setPollOptions([]);
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImages((prevImages) => [e.target.result, ...prevImages]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle audio recording
  const startRecording = async () => {
    //if there is images or polls then we should not record audio
    if (images.length > 0 || pollOptions.length > 0) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      const chunks: BlobPart[] = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const handleRecord = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  // Handle audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const value = (audio.currentTime / audio.duration) * 100;
      setProgress(value);
    };

    audio.addEventListener('timeupdate', updateProgress);
    const handleAudioEnd = () => {
      setIsPlaying(false);
      setProgress(0); // Reset progress when audio ends
    };
    audio.addEventListener('ended', handleAudioEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleAudioEnd);
    };
  }, []);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle poll options
  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <h1 className="text-center font-bold text-xl">What's happening?</h1>

      {/* Input Box */}
      <div className={`container mx-auto h-80 w-[80%] rounded-xl cursor-text border-solid border-2 border-[#780000] p-4 flex flex-col`}>
        {/* Input Box */}
        <textarea
          className="text-bold text-[#000000]/70 border-none bg-transparent select-none resize-none flex-grow mb-4"
          placeholder="Type a message..."
          onChange={(e) => setNewPost({...newPost, text: e.target.value})}
        />

        {/* Show poll options */}  
        <div className="flex flex-col gap-2">
          {pollOptions.map((option, index) => (
            <label key={index} className="relative w-full">
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...pollOptions];
                  newOptions[index] = e.target.value;
                  setPollOptions(newOptions);
                }}
                placeholder={`Option ${index + 1}`}
                className="pl-4 pr-10 py-2 w-full border-2 border-[#780000] rounded-xl"
              />
              
              {/* Close icon */}
              <IoIosClose
                onClick={() => {
                  const newOptions = [...pollOptions];
                  newOptions.splice(index, 1); // Remove the option at the current index
                  setPollOptions(newOptions);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#780000] cursor-pointer"
                size={20}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="flex space-x-4 justify-start w-[80%] mx-auto">
        {["Music", "Sports", "Food", "Art"].map((name: string, index: number) => (
          <div 
            key={index} 
            className={`snap-start w-12 h-6 shadow-[0px_-1px_2px_rgba(0,0,0,0.25),0px_1px_2px_rgba(0,0,0,0.25)] rounded-full cursor-pointer flex items-center text-center justify-center ${category === name ? 'bg-[#780000] text-zinc-100' : 'bg-[#FDF0D5]'}`}
            onClick={() => setCategory(name)}
          >
            <p className="text-center text-xs">{name}</p>
          </div>
        ))}
      </div>


      {/* Chose events */}
      <div className="flex flex-row mx-auto w-[80%] space-x-2">

        {/* Image Picker */}
        <div>
          <input
            type="file"
            id="imageInput"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button
            onClick={() => document.getElementById('imageInput').click()}
            disabled={images.length >= 10 || audioUrl !== null || pollOptions.length > 0}
          >
            <BiSolidImageAdd
              className="text-[#780000] cursor-pointer"
              size={35}
            />
          </button>
        </div>

        {/* Audio */}
        <div>
          <button
            onClick={handleRecord}
            className="relative"
            disabled={images.length > 0 || pollOptions.length > 0}
          >
            <div
              className={`absolute inset-0 text-[#780000] animate-ping ${
                isRecording ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <BiMicrophone className="w-8 h-8" />
            </div>
            <BiMicrophone
              className={`w-8 h-8 transition-colors duration-200 ${
                isRecording ? 'text-[#C1121F]' : 'text-[#780000]'
              }`}
            />
          </button>
        </div>

        {/* Poll */}
        <div>
          <button
            disabled={images.length > 0 || audioUrl !== null || pollOptions.length >= 4}
            onClick={() => addPollOption()}
          >
            <IoList
              className="text-[#780000] items-center cursor-pointer"
              size={35}
            />
          </button>
        </div>

        {/* Close choosen event */}
        {(images.length > 0 || audioUrl || pollOptions.length > 0) && (
          <div>
            <button
              onClick={() => {
                setImages([]);
                setAudioUrl(null);
                stopRecording();
                setPollOptions([]);
              }}
              className="absolute right-[10%] -mt-1.5"
            >
              <IoIosClose
                className="text-[#780000] cursor-pointer"
                size={45}
              />
            </button>
          </div>
        )}
      </div>

      {/* Display Images */}
      {images.length > 0 &&
        <div className="flex mx-auto w-[80%] space-x-2 overflow-x-scroll pb-2">
          {images.map((image, index) => (
            <img
            key={index}
            src={image}
            alt={`selected-${index}`}
            className="w-[65px] h-[65px] object-cover rounded-md border"
            />
          ))}
        </div>
      }

      <div className="w-[80%] mx-auto">
        {/* Display audio */}
        {audioUrl &&
          <div className="flex items-center">
            <button
              onClick={togglePlayback}
              className="text-[#780000] hover:text-[#780000] transition-colors"
            >
              {isPlaying ? (
                <IoPauseOutline size={40} />
              ) : (
                <IoPlayOutline size={40} />
              )}
            </button>
            
            {/* change this after rec to see animation ??  */}
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden w-full mx-auto mr-1">
              <div
                style={{ width: `${progress}%` }}
                className={"h-full bg-[#780000] transition-all duration-100"}
              />
            </div>
            
            <audio ref={audioRef} src={audioUrl} />
          </div>
        }
      </div>

      {/* Save Button */}
      <button 
        onClick={handleSubmit}
        className="bg-[#780000] text-[#FDF0D5] font-semibold mx-auto h-10 w-[80%] rounded-full text-center flex justify-center items-center"
      >
        Share
      </button>
    </div>
  );
};

export default NewEvent;
