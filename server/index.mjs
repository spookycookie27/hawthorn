import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import db from "./db/conn.mjs";

import auth from "./routers/auth.mjs";
import email from "./routers/email.mjs";
import createVideosRouter from "./routers/createVideosRouter.js";
import createBlogPostsRouter from "./routers/createBlogPostsRouter.js";
import createEventsRouter from "./routers/createEventsRouter.js";

// Creating an Express application instance
const PORT = process.env.PORT;
const app = express();

app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Load the /posts routes example
//app.use("/posts", posts);

app.use("/auth", auth);
app.use("/email", email);
app.use("/events", createEventsRouter(db));
app.use("/videos", createVideosRouter(db));
app.use("/blogposts", createBlogPostsRouter(db));

// Global error handling
app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(500).send("Uh oh! An unexpected error occured.");
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
