import { getUserData } from '@/utils/auth';
import type { EEvent, LikeEvent, PollAnswerEvent, Post } from '@/utils/types';
import { useState } from 'react';

interface IPost {
  postData: Post;
  userEvents: any;
  setEvents: (events: any) => void;
}

const Post = ({
  postData,
  userEvents,
  setEvents,
}: IPost) => {
  const {username, id} = getUserData();

  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);

  const likes = postData.childrenEvents?.filter(e => e.type === "like") || [];
  const comments = postData.childrenEvents?.filter(e => e.type === "comment") || [];

  if (postData.attachments.type === "poll") {
    var pollAnswers = postData.childrenEvents?.filter(e => e.type === "pollAnswer") || [];
    var userAnsweredPoll = pollAnswers.find(p => p.userData.id === id);
    var totalVotes = pollAnswers.length;
    var voteCounts = postData.attachments.data.map((_, index) => pollAnswers.filter(answer => answer.answer === index).length);
    var votePercentages = voteCounts.map(count => totalVotes > 0 ? (count / totalVotes * 100).toFixed(1) : "0");
  }

  const userLiked = likes.find(l => l.userData.id === id);

  const handleLike = () => {
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

  const handlePollAnswer = (index: number) => {
    if (userAnsweredPoll && userAnsweredPoll.answer === index) {
      return;
    }
    let updatedUserEvents = userEvents.filter(e => !(e.type === "pollAnswer" && e.postId === postData.eventId));
    const newPollAnswerEvent = {
      type: "pollAnswer",
      eventId: Math.random().toString(36).substr(2, 8),
      userData: {username, id},
      postId: postData.eventId,
      answer: index
    };
    setEvents([newPollAnswerEvent, ...updatedUserEvents]);
  }

  const handleCommentSubmit = () => {
    const newCommentEvent = {
      type: "comment",
      eventId: Math.random().toString(36).substr(2, 8),
      userData: {username, id},
      postId: postData.eventId,
      text: commentText
    };
    setEvents([newCommentEvent, ...userEvents]);
    setCommentText('');
    setShowCommentInput(false);
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4 w-full">
      <p className="text-lg font-bold">{postData.userData.username}</p>
      <p className="text-gray-700">{postData.text}</p>
      <div className="flex space-x-4 mt-2">
        <p className="text-blue-500 cursor-pointer" onClick={handleLike}>{likes.length} Likes</p>
        <p className="text-green-500 cursor-pointer" onClick={() => setShowCommentInput(!showCommentInput)}>{comments.length} Comments</p>
      </div>

      {/* Poll section */}
      {postData.attachments.type === "poll" && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="font-semibold">Poll</p>
          {postData.attachments.data.map((answer: string, index: number) => (
            <div key={index} className={`p-2 ${userAnsweredPoll?.answer === index ? "bg-blue-200" : "bg-gray-200"}`} onClick={() => handlePollAnswer(index)}>
              {index + 1}. {answer} - {votePercentages[index]}% ({voteCounts[index]} votes)
            </div>
          ))}
        </div>
      )}

      {/* Comments section */}
      {comments.map(comment => (
        <div key={comment.eventId} className="mt-2 p-2 bg-gray-100 rounded">
          <p className="font-semibold">{comment.userData.username}</p>
          <p className="text-gray-700">{comment.text}</p>
        </div>
      ))}

      {/* New Comment section */}
      {showCommentInput && (
        <div className="mt-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Write a comment..."
          />
          <button onClick={handleCommentSubmit} className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Submit</button>
        </div>
      )}
    </div>
  )
}

export default Post