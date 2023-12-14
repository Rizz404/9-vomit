import mongoose, { Document } from "mongoose";

interface IComment {
  userId: mongoose.Schema.Types.ObjectId;
  postId: mongoose.Schema.Types.ObjectId;
  content: string;
  upvotes: {
    userId: mongoose.Schema.Types.ObjectId[];
    count: number;
  };
  downvotes: {
    userId: mongoose.Schema.Types.ObjectId[];
    count: number;
  };
  image: string;
  repliedTo: mongoose.Schema.Types.ObjectId;
  repliesCount: number;
}

export interface CommentDocument extends IComment, Document {}

const CommentSchema = new mongoose.Schema<CommentDocument>(
  {
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
    postId: { type: mongoose.SchemaTypes.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
    image: String,
    upvotes: {
      userId: { type: [mongoose.SchemaTypes.ObjectId], ref: "User", default: [] },
      count: { type: Number, default: 0 },
    },
    downvotes: {
      userId: { type: [mongoose.SchemaTypes.ObjectId], ref: "User", default: [] },
      count: { type: Number, default: 0 },
    },
    repliedTo: { type: mongoose.SchemaTypes.ObjectId, ref: "Comment" },
    repliesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<CommentDocument>("Comment", CommentSchema);
