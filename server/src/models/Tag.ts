import mongoose, { Document } from "mongoose";

interface ITag {
  name: string;
  posts: mongoose.Schema.Types.ObjectId[];
  postsCount: number;
  description: string;
}

export interface TagDocument extends ITag, Document {}

const TagSchema = new mongoose.Schema<TagDocument>(
  {
    name: { type: String, unique: true, index: true, required: true },
    posts: { type: [mongoose.SchemaTypes.ObjectId], ref: "Post", default: [] },
    postsCount: { type: Number, default: 0 },
    description: String,
  },
  { timestamps: true }
);

TagSchema.pre("save", function (next) {
  this.postsCount = this.posts.length;
  next();
});

export default mongoose.model<TagDocument>("Tag", TagSchema);
