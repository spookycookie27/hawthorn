import express from "express";
import { ObjectId } from "mongodb";

const createVideosRouter = (db) => {
  const router = express.Router();
  const collectionName = "videos";

  // Get a list of videos
  router.get("/get", async (req, res) => {
    try {
      const collection = db.collection(collectionName);
      const results = await collection.find({}).toArray();
      res.status(200).send(results);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch videos" });
    }
  });

  // Add a new video
  router.post("/post", async (req, res) => {
    try {
      const collection = db.collection(collectionName);
      const newDocument = { ...req.body, date: new Date() };
      const result = await collection.insertOne(newDocument);
      res.status(201).send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to create video" });
    }
  });

  // Update a video
  router.patch("/patch/:id", async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      const collection = db.collection(collectionName);
      const result = await collection.replaceOne(query, req.body);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to update video" });
    }
  });

  // Delete a video
  router.delete("/delete/:id", async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      const collection = db.collection(collectionName);
      const result = await collection.deleteOne(query);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to delete video" });
    }
  });

  return router;
};

export default createVideosRouter;
