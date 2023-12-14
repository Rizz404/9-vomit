interface Post {
  _id?: string;
  userId?: {
    _id: string;
    username: string;
    email: string;
    fullname: string;
    profilePict: File;
  };
  title: string;
  description?: string;
  tags: [{ name?: string }];
  images?: File[];
  upvotes?: {
    userId: string[];
    count: number;
  };
  downvotes?: {
    userId: string[];
    count: number;
  };
  commentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

type PostsCategory = "home" | "top" | "trending" | "fresh" | "self" | "user";

interface VotePayload {
  _id?: string;
  postId: string;
  action: "upvote" | "downvote";
}

interface CategoryPayload {
  category: PostsCategory;
  userId?: string;
}

interface DeletePayload {
  _id?: string;
  postId: string;
}
