import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, Event, Gallery, Blog, Leaderboard, Department } from "./schema.js";

dotenv.config();
const { JWT_SECRET, MONGO_DB_URI } = process.env;

mongoose
  .connect(MONGO_DB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// JWT Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Auth: Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

// --- CRUD Endpoints (all protected) ---

// Events
app.get("/api/events", async (req, res) => {
  const events = await Event.find({});
  res.json(events);
});
app.post("/api/events", authenticateToken, async (req, res) => {
  const {
    title,
    description,
    date,
    time,
    location,
    capacity,
    registered,
    type,
    image,
    tags,
    featured,
  } = req.body;
  const result = await Event.insertOne({
    title,
    description,
    date,
    time,
    location,
    capacity: parseInt(capacity),
    registered: parseInt(capacity),
    type,
    image,
    tags,
    featured: featured ? true : false,
  });
  res.json({ id: result.insertedId });
});
app.put("/api/events", authenticateToken, async (req, res) => {
  const { id } = req.body.id;
  const {
    title,
    description,
    date,
    time,
    location,
    capacity,
    registered,
    type,
    image,
    tags,
    featured,
  } = req.body;

  Event.findByIdAndUpdate(id, {
    title,
    description,
    date,
    time,
    location,
    capacity,
    registered,
    type,
    image,
    tags,
    featured: featured ? true : false,
  });
  res.json({ success: true });
});
app.delete("/api/events/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  await Event.deleteOne({ _id: id });
  res.json({ success: true });
});

// Gallery
app.get("/api/gallery", async (req, res) => {
  const gallery = await Gallery.find({});
  res.json(gallery);
});
app.post("/api/gallery", authenticateToken, async (req, res) => {
  const { title, description, image, date, category, tags } = req.body;
  const result = await Gallery.insertOne({
    title,
    description,
    image,
    date,
    category,
    tags,
  });
  res.json({ id: result.insertedId });
});
app.put("/api/gallery/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, image, date, category, tags } = req.body;
  await Gallery.findByIdAndUpdate(id, {
    title,
    description,
    image,
    date,
    category,
    tags,
  });
  res.json({ success: true });
});
app.delete("/api/gallery/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  await Gallery.findByIdAndDelete(id);
  res.json({ success: true });
});

// Leaderboard
app.get("/api/leaderboard", async (req, res) => {
  const leaderboard = await Leaderboard.find({}).sort({ score: -1, name: -1 });
  res.json(leaderboard);
});
app.post("/api/leaderboard", authenticateToken, async (req, res) => {
  const { name, score, department } = req.body;
  const result = await Leaderboard.insertOne({ name, score, department });
  res.json({ id: result.insertedId });
});
app.put("/api/leaderboard/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, score, department } = req.body;
  await Leaderboard.findByIdAndUpdate(id, { name, score, department });
  res.json({ success: true });
});
app.delete("/api/leaderboard/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  await Leaderboard.findByIdAndDelete(id);
  res.json({ success: true });
});

// Blog
app.get("/api/blog", async (req, res) => {
  const blog = await Blog.find({});
  res.json(blog);
});
app.post("/api/blog", authenticateToken, async (req, res) => {
  const { title, author, body, tags, date, image } = req.body;
  const result = await Blog.insertOne({
    title,
    author,
    body,
    tags,
    date,
    image,
  });
  res.json({ id: result.insertedId });
});
app.put("/api/blog/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, author, body, tags, date, image } = req.body;
  await Blog.findByIdAndUpdate(id, { title, author, body, tags, date, image });
  res.json({ success: true });
});
app.delete("/api/blog/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  await Blog.findByIdAndDelete(id)
  res.json({ success: true });
});

app.get("/api/departments", async (req, res) => {
  res.json({departmentsData})
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

const departmentsData = [
  {
    image: "",
    name: "Web",
    description: "Fill this",
    type: "Technical",
    leads: [
      {
        name: "W1",
        title: "Web Lead",
        image: "",
      },
      {
        name: "W2",
        title: "Web SubLead",
        image: "",
      },
      {
        name: "W3",
        title: "Web SubLead",
        image: "",
      },
    ],
  },
  {
    image: "",
    name: "AIML",
    description: "Fill this",
    type: "Technical",
    leads: [
      {
        name: "A1",
        title: "AIML Lead",
        image: "",
      },
      {
        name: "A2",
        title: "AIML SubLead",
        image: "",
      },
      {
        name: "A3",
        title: "AIML SubLead",
        image: "",
      },
    ],
  },
  {
    image: "",
    name: "RObotics",
    description: "Fill this",
    type: "Technical",
    leads: [
      {
        name: "R1",
        title: "Robotics Lead",
        image: "",
      },
      {
        name: "R2",
        title: "Robotics SubLead",
        image: "",
      },
      {
        name: "R3",
        title: "Robotics SubLead",
        image: "",
      },
    ],
  },
];

export default app;
