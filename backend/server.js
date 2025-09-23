import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();
const {JWT_SECRET} = process.env;

const app = express();
app.use(cors());
app.use(express.json());

// SQLite connection
const dbPromise = open({
  filename: 'db.sqlite',
  driver: sqlite3.Database
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// JWT Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Audit log helper
async function logAudit(user_id, action, details) {
  const db = await dbPromise;
  await db.run(
    'INSERT INTO audit_log (user_id, action, details) VALUES (?, ?, ?)',
    [user_id, action, details]
  );
}

// Auth: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await dbPromise;
    const user = await db.get('SELECT * FROM users WHERE username = ?', username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '8h' });
    await logAudit(user.id, 'login', 'User logged in');
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// --- CRUD Endpoints (all protected) ---

// Events
app.get('/api/events', async (req, res) => {
  const db = await dbPromise;
  const events = await db.all('SELECT * FROM events');
  res.json(events);
});
app.post('/api/events', authenticateToken, async (req, res) => {
  const db = await dbPromise;
  const { title, description, date, time, location, capacity, registered, type, image, tags, featured } = req.body;
  const result = await db.run(
    'INSERT INTO events (title, description, date, time, location, capacity, registered, type, image, tags, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [title, description, date, time, location, capacity, registered, type, image, tags, featured ? 1 : 0]
  );
  await logAudit(req.user.id, 'create_event', `Event: ${title}`);
  res.json({ id: result.lastID });
});
app.put('/api/events', authenticateToken, async (req, res) => {
  const db = await dbPromise;
  const { id } = req.body.id;
  const { title, description, date, time, location, capacity, registered, type, image, tags, featured } = req.body;
  await db.run(
    'UPDATE events SET title=?, description=?, date=?, time=?, location=?, capacity=?, registered=?, type=?, image=?, tags=?, featured=? WHERE id=?',
    [title, description, date, time, location, capacity, registered, type, image, tags, featured ? 1 : 0, id]
  );
  await logAudit(req.user.id, 'update_event', `Event ID: ${id}`);
  res.json({ success: true });
});
app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  const db = await dbPromise;
  const { id } = req.params;
  await db.run('DELETE FROM events WHERE id=?', id);
  await logAudit(req.user.id, 'delete_event', `Event ID: ${id}`);
  res.json({ success: true });
});

// Gallery
app.get('/api/gallery', async (req, res) => {
  const db = await dbPromise;
  const gallery = await db.all('SELECT * FROM gallery');
  res.json(gallery);
});
app.post('/api/gallery', authenticateToken, async (req, res) => {
  const db = await dbPromise;
  const { title, description, image, date, category, tags } = req.body;
  const result = await db.run(
    'INSERT INTO gallery (title, description, image, date, category, tags) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, image, date, category, tags]
  );
  await logAudit(req.user.id, 'create_gallery', `Gallery: ${title}`);
  res.json({ id: result.lastID });
});
app.put('/api/gallery/:id', authenticateToken, async (req, res) => {
  const db = await dbPromise;
  const { id } = req.params;
  const { title, description, image, date, category, tags } = req.body;
  await db.run(
    'UPDATE gallery SET title=?, description=?, image=?, date=?, category=?, tags=? WHERE id=?',
    [title, description, image, date, category, tags, id]
  );
  await logAudit(req.user.id, 'update_gallery', `Gallery ID: ${id}`);
  res.json({ success: true });
});
app.delete('/api/gallery/:id', authenticateToken, async (req, res) => {
  const db = await dbPromise;
  const { id } = req.params;
  await db.run('DELETE FROM gallery WHERE id=?', id);
  await logAudit(req.user.id, 'delete_gallery', `Gallery ID: ${id}`);
  res.json({ success: true });
});

// Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  const db = await dbPromise;
  const leaderboard = await db.all('SELECT * FROM leaderboard ORDER BY rank ASC');
  res.json(leaderboard);
});
app.post('/api/leaderboard', authenticateToken, async (req, res) => {
  const db = await dbPromise;
  const { name, score, rank, department } = req.body;
  const result = await db.run(
    'INSERT INTO leaderboard (name, score, rank, department) VALUES (?, ?, ?, ?)',
    [name, score, rank, department]
  );
  await logAudit(req.user.id, 'create_leaderboard', `Name: ${name}`);
  res.json({ id: result.lastID });
});
app.put('/api/leaderboard/:id', authenticateToken, async (req, res) => {
  const db = await dbPromise;
  const { id } = req.params;
  const { name, score, rank, department } = req.body;
  await db.run(
    'UPDATE leaderboard SET name=?, score=?, rank=?, department=? WHERE id=?',
    [name, score, rank, department, id]
  );
  await logAudit(req.user.id, 'update_leaderboard', `Leaderboard ID: ${id}`);
  res.json({ success: true });
});
app.delete('/api/leaderboard/:id', authenticateToken, async (req, res) => {
  const db = await dbPromise;
  const { id } = req.params;
  await db.run('DELETE FROM leaderboard WHERE id=?', id);
  await logAudit(req.user.id, 'delete_leaderboard', `Leaderboard ID: ${id}`);
  res.json({ success: true });
});

// Blog
app.get('/api/blog', authenticateToken, async (req, res) => {
  const db = await dbPromise;
  const blog = await db.all('SELECT * FROM blog');
  res.json(blog);
});
app.post('/api/blog', authenticateToken, async (req, res) => {
  const db = await dbPromise;
  const { title, author, body, tags, date, image } = req.body;
  const result = await db.run(
    'INSERT INTO blog (title, author, body, tags, date, image) VALUES (?, ?, ?, ?, ?, ?)',
    [title, author, body, tags, date, image]
  );
  await logAudit(req.user.id, 'create_blog', `Blog: ${title}`);
  res.json({ id: result.lastID });
});
app.put('/api/blog/:id', authenticateToken, async (req, res) => {
  const db = await dbPromise;
  const { id } = req.params;
  const { title, author, body, tags, date, image } = req.body;
  await db.run(
    'UPDATE blog SET title=?, author=?, body=?, tags=?, date=?, image=? WHERE id=?',
    [title, author, body, tags, date, image, id]
  );
  await logAudit(req.user.id, 'update_blog', `Blog ID: ${id}`);
  res.json({ success: true });
});
app.delete('/api/blog/:id', authenticateToken, async (req, res) => {
  const db = await dbPromise;
  const { id } = req.params;
  await db.run('DELETE FROM blog WHERE id=?', id);
  await logAudit(req.user.id, 'delete_blog', `Blog ID: ${id}`);
  res.json({ success: true });
});

// Audit log (view)
app.get('/api/audit', authenticateToken, async (req, res) => {
  const db = await dbPromise;
  const logs = await db.all('SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 100');
  res.json(logs);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

export default app;
export { dbPromise };
