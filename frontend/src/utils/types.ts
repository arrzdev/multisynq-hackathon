export type PollAnswerEvent = {
  type: "pollAnswer";
  eventId: string;
  userData: {
    id: string;
    username: string;
  };
  postId: string;
  answer: number;
}

export type LikeEvent = {
  type: "like";
  eventId: string;
  userData: {
    id: string;
    username: string;
  };
  postId: string;
}

export type CommentEvent = {
  type: "comment";
  eventId: string;
  userData: {
    id: string;
    username: string;
  };
  postId: string;
  text: string;
}

export type Attachment = {
  type: "media";
  data: Buffer[];
} | {
  type: "audio";
  data: Buffer;
} | {
  type: "poll";
  data: string[];
} | null;

export type PostEvent = {
  type: "post";
  eventId: string;
  userData: {
    id: string;
    username: string;
  };
  text: string;
  category: string;
  geoLocation: {latitude: number, longitude: number, near: string};
  attachments: Attachment;
}

export interface Post extends PostEvent {
  childrenEvents: (PollAnswerEvent | LikeEvent | CommentEvent)[];
}

export type EEvent = PostEvent | PollAnswerEvent | LikeEvent | CommentEvent;