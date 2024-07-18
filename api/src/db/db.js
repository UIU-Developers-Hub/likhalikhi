import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// console.log(DB_NAME)
// console.log("salam->", process.env.MONGODB_URI);

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    // console.log(`\n connectionInstace : ${connectionInstance}`);
    console.log(
      `\n MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.log("MONGODB connection in db.js error: ", err);
    process.exit(1);
  }
};

export default connectDB;
