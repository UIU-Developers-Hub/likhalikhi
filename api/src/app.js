import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

//app.use for middleware using
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //to get data from URL
app.use(express.static("public")); // create a  folder named public and store img/png type data in server.
app.use(cookieParser());

export default app;
