interface Comment {
  _id?: string;
  userId?: {
    _id: string;
    username: string;
    email: string;
    fullname: string;
    profilePict: string;
  };
  postId: string;
  image?: File;
  content: string;
  repliedTo?: string;
  repliesCount?: number;
  upvotes?: {
    userId: string[];
    count: number;
  };
  downvotes?: {
    userId: string[];
    count: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface VoteCommentPayload {
  _id?: string;
  commentId: string;
  action: "upvote" | "downvote";
}
