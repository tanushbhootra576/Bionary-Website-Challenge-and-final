import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, Event, Gallery, Blog, Leaderboard, Department, Team } from "./schema.js";

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
  jwt.verify(token, JWT_SECRET, (err, user) => {
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
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// --- Events CRUD ---
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/events", authenticateToken, async (req, res) => {
  try {
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

    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      capacity: parseInt(capacity) || 0,
      registered: parseInt(registered) || 0,
      type,
      image,
      tags,
      featured: featured ? true : false,
    });

    const result = await event.save();
    res.json({ id: result._id, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/events/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
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

    await Event.findByIdAndUpdate(id, {
      title,
      description,
      date,
      time,
      location,
      capacity: parseInt(capacity) || 0,
      registered: parseInt(registered) || 0,
      type,
      image,
      tags,
      featured: featured ? true : false,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/events/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Gallery CRUD ---
app.get("/api/gallery", async (req, res) => {
  try {
    const gallery = await Gallery.find({});
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/gallery", authenticateToken, async (req, res) => {
  try {
    const { title, description, image, date, category, tags } = req.body;
    const gallery = new Gallery({
      title,
      description,
      image,
      date,
      category,
      tags,
    });
    const result = await gallery.save();
    res.json({ id: result._id, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/gallery/:id", authenticateToken, async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/gallery/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Gallery.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Leaderboard CRUD ---
app.get("/api/leaderboard", async (req, res) => {
  try {
    // Paging, sorting, filtering (source: Team.points)
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '10')));
    const sortBy = req.query.sortBy || 'points';
    const order = req.query.order === 'asc' ? 1 : -1; // default desc
    const q = req.query.q || '';
    const department = req.query.department || '';

    const filter = {};
    if (q) {
      filter.name = { $regex: q, $options: 'i' };
    }
    if (department) {
      filter.department = department;
    }

    const total = await Team.countDocuments(filter);

    // Map sortBy to actual Team field names (accept 'score' for backward compatibility)
    const sortField = sortBy === 'score' ? 'points' : sortBy;

    const data = await Team.find(filter)
      .sort({ [sortField]: order, name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Compute global rank for each returned item (based on points desc, name asc)
    const mapped = [];
    for (const obj of data) {
      const pointsVal = Number(obj.points ?? 0);
      const nameVal = obj.name || '';
      const betterCount = await Team.countDocuments({
        $or: [
          { points: { $gt: pointsVal } },
          { points: pointsVal, name: { $lt: nameVal } }
        ]
      });
      mapped.push({
        id: obj._id,
        name: obj.name,
        department: obj.department,
        score: pointsVal, // frontend expects `score`
        rank: betterCount + 1,
      });
    }

    res.json({ total, page, limit, data: mapped });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/leaderboard", authenticateToken, async (req, res) => {
  try {
    const { name, score, department } = req.body;
    const entry = new Leaderboard({
      name,
      score: parseInt(score) || 0,
      department
    });
    const result = await entry.save();
    res.json({ id: result._id, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/leaderboard/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, score, department } = req.body;
    await Leaderboard.findByIdAndUpdate(id, {
      name,
      score: parseInt(score) || 0,
      department
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/leaderboard/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Leaderboard.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Blog CRUD ---
app.get("/api/blog", async (req, res) => {
  try {
    const blog = await Blog.find({}).sort({ date: -1 });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/blog", authenticateToken, async (req, res) => {
  try {
    const { title, author, body, tags, date, image } = req.body;
    const blog = new Blog({
      title,
      author,
      body,
      tags,
      date,
      image,
    });
    const result = await blog.save();
    res.json({ id: result._id, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/blog/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, body, tags, date, image } = req.body;
    await Blog.findByIdAndUpdate(id, {
      title,
      author,
      body,
      tags,
      date,
      image
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/blog/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Department CRUD ---
app.get("/api/departments", async (req, res) => {
  try {
    const departments = await Department.find({});
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/departments", authenticateToken, async (req, res) => {
  try {
    const { name, description, type, image, leads } = req.body;
    const department = new Department({
      name,
      description,
      type,
      image,
      leads: leads || [],
    });
    const result = await department.save();
    res.json({ id: result._id, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/departments/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type, image, leads } = req.body;
    await Department.findByIdAndUpdate(id, {
      name,
      description,
      type,
      image,
      leads: leads || [],
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/departments/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Department.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Team ---
// Public: list all team members
app.get('/api/team', async (req, res) => {
  try {
    const members = await Team.find({}).sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected: create a team member (admins)
app.post('/api/team', authenticateToken, async (req, res) => {
  try {
    const { name, role, department, batch, bio, skills, image, github, linkedin, email, points } = req.body;
    const member = new Team({ name, role, department, batch, bio, skills, image, github, linkedin, email, points });
    const result = await member.save();
    res.json({ id: result._id, success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

export default app;
