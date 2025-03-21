import request from "supertest";
import express from "express";
import createBlogPostsRouter from "../../routers/createBlogPostsRouter";

describe("BlogPosts Router", () => {
  let app;
  let mockDb;

  beforeEach(() => {
    mockDb = {
      collection: jest.fn().mockReturnValue({
        find: jest
          .fn()
          .mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) }),
        insertOne: jest.fn().mockResolvedValue({ insertedId: "123" }),
        replaceOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      }),
    };

    app = express();
    app.use(express.json());
    app.use("/blogposts", createBlogPostsRouter(mockDb));
  });

  it("should fetch blog posts", async () => {
    const response = await request(app).get("/blogposts/get");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(mockDb.collection).toHaveBeenCalledWith("posts");
  });

  it("should create a blog post", async () => {
    const newPost = { title: "Test Post" };
    const response = await request(app).post("/blogposts/post").send(newPost);
    expect(response.status).toBe(201);
    expect(mockDb.collection).toHaveBeenCalledWith("posts");
  });

  it("should update a blog post", async () => {
    const updatedPost = { title: "Updated Post" };
    const response = await request(app)
      .patch("/blogposts/patch/012345678901234567890123")
      .send(updatedPost);
    expect(response.status).toBe(200);
    expect(mockDb.collection).toHaveBeenCalledWith("posts");
  });

  it("should delete a blog post", async () => {
    const response = await request(app).delete(
      "/blogposts/delete/012345678901234567890123"
    );
    expect(response.status).toBe(200);
    expect(mockDb.collection).toHaveBeenCalledWith("posts");
  });
});
