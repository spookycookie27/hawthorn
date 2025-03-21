import request from "supertest";
import express from "express";
import router from "../../routes/auth.mjs";
import pkg from "jsonwebtoken";

const { sign } = pkg;

// Mock express app
const app = express();
app.use(express.json());
app.use("/", router);

// Mock secret key
const SECRET_KEY = "your-secret-key";

describe("Auth Routes", () => {
  let validToken;

  beforeAll(() => {
    // Generate a valid token for testing
    validToken = sign({ email: "sp.cooke@me.com" }, SECRET_KEY, {
      expiresIn: "4h",
    });
  });

  test("GET / - should return welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Welcome to the User Authentication API!");
  });

  test("POST /login - should return token for valid credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "sp.cooke@me.com", pass: "Chajamrob1" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("POST /login - should return 401 for invalid credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "invalid@me.com", pass: "wrongpass" });
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: "Invalid credentials" });
  });

  test("GET /user - should return user details for valid token", async () => {
    const res = await request(app)
      .get("/user")
      .set("Authorization", validToken);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ email: "sp.cooke@me.com" });
  });

  test("GET /user - should return 401 for missing token", async () => {
    const res = await request(app).get("/user");
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: "Unauthorized" });
  });

  test("GET /user - should return 401 for invalid token", async () => {
    const res = await request(app)
      .get("/user")
      .set("Authorization", "invalid-token");
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: "Unauthorized" });
  });
});
