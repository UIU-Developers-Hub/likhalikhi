import dotenv from "dotenv";
import app from "./app.js";
import { PORT } from "./constants.js";
import connectDB from "./db/db.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(PORT || 8000, () => {
      console.log(`Server is runnign at port: ${PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("Mongo db connection failed in index.js , error: ", err);
  });
