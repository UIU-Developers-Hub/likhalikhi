import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

// create app instance
const app = express();

// Set up CORS options
const corsOptions = {
  // origin: ["https://likhalikhi.vercel.app"], // Allow only your frontend domain
  origin: ["http://localhost:5173"], // Allow only your frontend domain
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

//add middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //to get data from URL
app.use(express.static("public")); // create a  folder named public and store img/png type data in server.
app.use(cookieParser());

//import  here

import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";

// Define routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  const cookies = req.cookies;
  res.send(`SERVER IS WORKING BRO...! Cookies: ${JSON.stringify(cookies)}`);
});

export default app;
