import request from "supertest";
import express from "express";
import createVideosRouter from "../../routers/createVideosRouter";

describe("Videos Router", () => {
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
    app.use("/videos", createVideosRouter(mockDb));
  });

  it("should fetch videos", async () => {
    const response = await request(app).get("/videos/get");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(mockDb.collection).toHaveBeenCalledWith("videos");
  });

  it("should create a video", async () => {
    const newVideo = { title: "Test Video" };
    const response = await request(app).post("/videos/post").send(newVideo);
    expect(response.status).toBe(201);
    expect(mockDb.collection).toHaveBeenCalledWith("videos");
  });

  it("should update a video", async () => {
    const updatedVideo = { title: "Updated Video" };
    const response = await request(app)
      .patch("/videos/patch/012345678901234567890123")
      .send(updatedVideo);
    expect(response.status).toBe(200);
    expect(mockDb.collection).toHaveBeenCalledWith("videos");
  });

  it("should delete a video", async () => {
    const response = await request(app).delete(
      "/videos/delete/012345678901234567890123"
    );
    expect(response.status).toBe(200);
    expect(mockDb.collection).toHaveBeenCalledWith("videos");
  });
});
