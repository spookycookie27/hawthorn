import express from "express";
import { ObjectId } from "mongodb";

const createEventsRouter = (db) => {
  const router = express.Router();
  const collectionName = "events";

  // Get a list of 50 posts
  router.get("/get", async (req, res) => {
    try {
      const collection = db.collection(collectionName);
      const results = await collection.find({}).toArray();
      res.status(200).send(results);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch events" });
    }
  });

  // Add a new post
  router.post("/post", async (req, res) => {
    try {
      const collection = db.collection(collectionName);
      const newDocument = { ...req.body, date: new Date() };
      const result = await collection.insertOne(newDocument);
      res.status(201).send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to create event" });
    }
  });

  // Update a post
  router.patch("/patch/:id", async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      const collection = db.collection(collectionName);
      const result = await collection.replaceOne(query, req.body);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to update event" });
    }
  });

  // Delete an entry
  router.delete("/delete/:id", async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      const collection = db.collection(collectionName);
      const result = await collection.deleteOne(query);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to delete event" });
    }
  });

  return router;
};

export default createEventsRouter;
