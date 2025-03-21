import express from "express";
import pkg from "jsonwebtoken";
const { verify, sign } = pkg;

const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;
const USERS = [
  { email: process.env.STEVE_LOGIN, pass: process.env.STEVE_PASS },
  { email: process.env.AMY_LOGIN, pass: process.env.AMY_PASS },
];

// Middleware for JWT validation
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};

// Function to validate user credentials
const isValidLogin = ({ email, pass }) => {
  return USERS.some((user) => user.email === email && user.pass === pass);
};

// Route to authenticate and log in a user
router.post("/login", async (req, res) => {
  try {
    const { email, pass } = req.body;

    // Validate user credentials
    if (!isValidLogin({ email, pass })) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = sign({ email }, SECRET_KEY, { expiresIn: "4h" });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Protected route to get user details
router.get("/user", verifyToken, async (req, res) => {
  try {
    const user = USERS.find((u) => u.email === req.user.email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ email: req.user.email });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Default route
router.get("/", (req, res) => {
  res.send("Welcome to the User Authentication API!");
});

export default router;
