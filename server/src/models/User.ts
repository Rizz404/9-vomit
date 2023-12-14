import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  username: string;
  email: string;
  password: string;
  roles: "Admin" | "User";
  fullname: string;
  bio: string;
  following: mongoose.Schema.Types.ObjectId[];
  followers: mongoose.Schema.Types.ObjectId[];
  profilePict: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserDocument extends IUser, Document {}

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 5 },
    roles: { type: String, enum: ["Admin", "User"], default: "User" },
    fullname: { type: String, maxlength: 100 },
    bio: String,
    following: { type: [mongoose.SchemaTypes.ObjectId], ref: "User", default: [] },
    followers: { type: [mongoose.SchemaTypes.ObjectId], ref: "User", default: [] },
    profilePict: String,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt();
    const hashedPw = await bcrypt.hash(this.password, salt);

    this.password = hashedPw;
    return next();
  } catch (error) {
    return next(error);
  }
});

export default mongoose.model<UserDocument>("User", UserSchema);
