# Synced City

- Made some changes to the useStateTogetherWithPerUserValues to persist data when users disconnect and to use custom key values for the users connected to the channel

App events can be:
 - type: post, like, comment,

Posts can have the following structures:
{
  type: "post",
  userId: string,
  eventId: string,
  text: string,
  attachments: {
    type: "media" | "audio" | "poll",
    data: buffer[] | buffer | text[]
  }
},

Poll answers have the following structure:
{
  type: "pollAnswer",
  userId: string,
  eventId: string,
  postId: string,
  answer: number // index of the option
}

Likes have the following structure:
{
  type: "like",
  userId: string,
  eventId: string,
  postId: string
}

Comments have the following structure:
{
  type: "comment",
  userId: string,
  eventId: string,
  postId: string,
  text: string
}
