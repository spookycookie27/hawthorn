import request from "supertest";
import express from "express";
import createEventsRouter from "../../routers/createEventsRouter";

describe("Events Router", () => {
  let app;
  let mockDb;

  beforeEach(() => {
    mockDb = {
      collection: jest.fn().mockReturnValue({
        find: jest
          .fn()
          .mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) }),
        insertOne: jest
          .fn()
          .mockResolvedValue({ insertedId: "012345678901234567890123" }),
        replaceOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      }),
    };

    app = express();
    app.use(express.json());
    app.use("/events", createEventsRouter(mockDb));
  });

  it("should fetch events", async () => {
    const response = await request(app).get("/events/get");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(mockDb.collection).toHaveBeenCalledWith("events");
  });

  it("should create an event", async () => {
    const newEvent = { name: "Test Event" };
    const response = await request(app).post("/events/post").send(newEvent);
    expect(response.status).toBe(201);
    expect(mockDb.collection).toHaveBeenCalledWith("events");
  });
});
