import mongoose, { Document } from "mongoose";

interface IPost {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  tags: mongoose.Schema.Types.ObjectId[];
  images: string[];
  upvotes: {
    userId: mongoose.Schema.Types.ObjectId[];
    count: number;
  };
  downvotes: {
    userId: mongoose.Schema.Types.ObjectId[];
    count: number;
  };
  commentsCount: number;
}

export interface PostDocument extends IPost, Document {}

const PostSchema = new mongoose.Schema<PostDocument>(
  {
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, index: true },
    tags: { type: [mongoose.SchemaTypes.ObjectId], ref: "Tag" },
    images: [String],
    description: String,
    upvotes: {
      userId: { type: [mongoose.SchemaTypes.ObjectId], ref: "User", default: [] },
      count: { type: Number, default: 0 },
    },
    downvotes: {
      userId: { type: [mongoose.SchemaTypes.ObjectId], ref: "User", default: [] },
      count: { type: Number, default: 0 },
    },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<PostDocument>("Post", PostSchema);
