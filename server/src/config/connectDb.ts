import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`mongo db connected ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
