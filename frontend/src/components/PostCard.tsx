import React from "react";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { GoCommentDiscussion } from "react-icons/go";
import { IoLocationOutline } from "react-icons/io5";
import { getUserData } from "@/utils/auth";
import type { Post, LikeEvent } from "@/utils/types";
import { setDrawerState } from "@/components/Drawer";

interface IPost {
  postData: Post;
  userEvents: any;
  setEvents: (events: any) => void;
  setPostViewId: (id: string) => void;
}

const PostCard = ({
  postData,
  userEvents,
  setEvents,
  setPostViewId
}: IPost) => {
  const {id, username} = getUserData();

  const likes = postData.childrenEvents?.filter(e => e.type === "like") || [];
  const comments = postData.childrenEvents?.filter(e => e.type === "comment") || [];

  const userLiked = likes.find(l => l.userData.id === id);

  if (postData.attachments.type === "poll") {
    var pollAnswers = postData.childrenEvents?.filter(e => e.type === "pollAnswer") || [];
    var userAnsweredPoll = pollAnswers.find(p => p.userData.id === id);
    var totalVotes = pollAnswers.length;
    var voteCounts = postData.attachments.data.map((_, index) => pollAnswers.filter(answer => answer.answer === index).length);
    var votePercentages = voteCounts.map(count => totalVotes > 0 ? (count / totalVotes * 100).toFixed(1) : "0");
  }

  const handleLike = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!userLiked) {
      const newLikeEvent = {
        type: "like",
        eventId: Math.random().toString(36).substr(2, 8),
        userData: {username, id},
        postId: postData.eventId
      }
      setEvents([newLikeEvent as LikeEvent,...userEvents]);
      return;
    }
    const newUserEvents = userEvents.filter(e => e.eventId !== userLiked.eventId);
    setEvents(newUserEvents);
  }

  const handlePollAnswer = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    event.stopPropagation();
    //filter out any previous votes for this poll
    let updatedUserEvents = userEvents.filter(e => !(e.type === "pollAnswer" && e.postId === postData.eventId));

    if (userAnsweredPoll && userAnsweredPoll.answer === index) {
      //if user clicked the same option again, just remove the vote
      setEvents(updatedUserEvents);
      return;
    }

    //add the new vote
    const newPollAnswerEvent = {
      type: "pollAnswer",
      eventId: Math.random().toString(36).substr(2, 8),
      userData: {username, id},
      postId: postData.eventId,
      answer: index
    };
    setEvents([newPollAnswerEvent, ...updatedUserEvents]);
  }

  return (
    <div 
      className="container w-full h-auto p-5 bg-[#FDF0D5] rounded-2xl shadow-[0px_-2px_4px_rgba(0,0,0,0.5),0px_2px_4px_rgba(0,0,0,0.5)] mt-4 space-y-2" 
      onClick={() => {
        setPostViewId(postData.eventId);
        setDrawerState("post-view");
      }}
    >
      {/* Post by @... */}
      <div className="text-black/50 text-xs font-bold">
        post by @{postData.userData.username}
      </div>
      
      {/* Event Title */}
      <div className="flex justify-between items-center">
        <h1>
          {postData.text}
        </h1>
        {postData.category !== "" && (
          <span className="text-xs font-bold bg-[#780000] text-white px-2 py-1 rounded">
            {postData.category}
          </span>
        )}
      </div>

      {/* Image */}
      {postData.attachments.type === "media" && (
        <div className="h-[110px]">
          {/* @ts-ignore - TODO: fix this */}
          <img src={postData.attachments.data[0]} alt="" className="h-full rounded-lg" />
        </div>
      )}
      
      {/* Audio */}
      {postData.attachments.type === "audio" && (
        <div className="flex items-center space-x-2">
          Audio
        </div>
      )}

      {/* Poll */}
      {postData.attachments.type === "poll" && (
        <div className="flex flex-col space-y-2 my-4">
          {postData.attachments.data.map((answer: string, index: number) => (
            <div key={index} className="relative w-full" onClick={(event) => handlePollAnswer(event, index)}>
              <div className={`${userAnsweredPoll?.answer === index ? "bg-[#780000] text-zinc-100" : "bg-[#fdf0d5] text-[#780000] border-2 border-solid border-[#780000]"} p-3 rounded-lg cursor-pointer`}>
                {answer}
              </div>
              
              {/* Close icon */}
              <div className={`${userAnsweredPoll?.answer === index ? "bg-[#780000] text-zinc-100" : "bg-[#fdf0d5] text-[#780000]"} absolute right-3 top-1/2 transform -translate-y-1/2 text-[#780000] font-semibold cursor-pointer`}>
                <span> {votePercentages[index]}%</span>
                <span> ({voteCounts[index]} votes)</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interaction Buttons */}
      <div className="flex space-x-2 items-center w-full">
        <div className="flex space-x-2 items-center w-1/2">
          {/* Likes */}
          <button className="flex items-center space-x-1" onClick={(event) => handleLike(event)}>
            {userLiked ? (
              <IoMdHeart size={25} color="#780000"/>
            ) : (
              <IoMdHeartEmpty size={25} color="#780000"/>
            )}
            <div className="text-xs font-bold mt-1">
              {likes.length}
            </div>
          </button>

          {/* Comments */}
          <GoCommentDiscussion size={23} color="#780000"/>
          <div className="text-xs font-bold mt-1">
            {comments.length}
          </div>
        </div>

        {/* Location Icon */}
        <div className="flex items-center w-1/2 justify-end">
          <p className="text-left text-sm">near {postData?.geoLocation?.near || "unknown"}</p>
          <IoLocationOutline size={23} color="#780000"/>
        </div>

      </div>

    </div>
  )
};

export default PostCard;
