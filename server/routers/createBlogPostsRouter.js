import express from "express";
import { ObjectId } from "mongodb";
import { verifyToken } from "./auth.mjs";

const createBlogPostsRouter = (db) => {
  const router = express.Router();
  const collectionName = "posts";

  // Get a list of posts
  router.get("/get", async (req, res) => {
    try {
      const collection = db.collection(collectionName);
      const results = await collection.find({}).toArray();
      res.status(200).send(results);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch blog posts" });
    }
  });

  // Add a new post
  router.post("/post", verifyToken, async (req, res) => {
    try {
      const collection = db.collection(collectionName);
      const newDocument = { ...req.body, date: new Date() };
      const result = await collection.insertOne(newDocument);
      res.status(201).send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to create blog post" });
    }
  });

  // Update a post
  router.patch("/patch/:id", verifyToken, async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      const collection = db.collection(collectionName);
      const result = await collection.replaceOne(query, req.body);
      res.status(200).send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Failed to update blog post" });
    }
  });

  // Delete a post
  router.delete("/delete/:id", verifyToken, async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      const collection = db.collection(collectionName);
      const result = await collection.deleteOne(query);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to delete blog post" });
    }
  });

  return router;
};

export default createBlogPostsRouter;
