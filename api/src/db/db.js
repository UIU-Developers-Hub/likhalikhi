import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `\nMongoDB connected!! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};
export default connectDB;
// This file is responsible for connecting to the MongoDB database. It exports a function that connects to the database using the MONGO_URI environment variable. If the connection is successful, it logs "MongoDB connected". If there is an error, it logs "MongoDB connection error" and exits the process with an exit code of 1.
