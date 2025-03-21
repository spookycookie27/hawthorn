import express from "express";
import { ObjectId } from "mongodb";

const filterOldDates = (results) => {
  const filtered = results.filter((x) => {
    const date = new Date(x.eventDate);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date > yesterday;
  });
  return filtered;
};

const createEventsRouter = (db) => {
  const router = express.Router();
  const collectionName = "events";

  router.get("/get", async (req, res) => {
    try {
      const collection = db.collection(collectionName);
      const results = await collection.find({}).toArray();
      res.status(200).send(results);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch events" });
    }
  });

  router.get("/getfuture", async (req, res) => {
    try {
      const collection = db.collection(collectionName);
      const results = await collection.find({}).toArray();
      const filtered = filterOldDates(results);
      res.status(200).send(filtered);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch events" });
    }
  });

  router.get("/getpublic", async (req, res) => {
    try {
      const results = await db
        .collection(collectionName)
        .find({ isPrivate: false })
        .toArray();
      const filtered = filterOldDates(results);
      res.status(200).send(filtered);
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
