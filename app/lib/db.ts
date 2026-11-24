import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is missing");
    }

    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB Connected Successfully");

  } catch (error) {
    console.log("MongoDB Connection Failed", error);
    throw error;
  }
};

export default connectDB;