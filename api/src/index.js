import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/db.js";

// Configure dotenv
dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("MongoDB connection error in index.js:", err));
