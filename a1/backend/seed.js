import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const users = [
  { username: 'admin1', password: 'Password1!' },
  { username: 'admin2', password: 'Password2!' },
  { username: 'admin3', password: 'Password3!' },
  { username: 'admin4', password: 'Password4!' },
  { username: 'admin5', password: 'Password5!' },
  { username: 'admin6', password: 'Password6!' },
  { username: 'admin7', password: 'Password7!' },
  { username: 'admin8', password: 'Password8!' },
  { username: 'admin9', password: 'Password9!' },
  { username: 'admin10', password: 'Password10!' },
];

async function seed() {
  const db = await open({
    filename: 'db.sqlite',
    driver: sqlite3.Database
  });

  // Drop tables if exist
  await db.exec(`
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS gallery;
    DROP TABLE IF EXISTS leaderboard;
    DROP TABLE IF EXISTS blog;
    DROP TABLE IF EXISTS audit_log;
  `);

  // Create tables
  await db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      date TEXT,
      time TEXT,
      location TEXT,
      capacity INTEGER,
      registered INTEGER,
      type TEXT,
      image TEXT,
      tags TEXT,
      featured INTEGER DEFAULT 0
    );
    CREATE TABLE gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      image TEXT,
      date TEXT,
      category TEXT,
      tags TEXT
    );
    CREATE TABLE leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      score INTEGER,
      rank INTEGER,
      department TEXT
    );
    CREATE TABLE blog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      author TEXT,
      body TEXT,
      tags TEXT,
      date TEXT,
      image TEXT
    );
    CREATE TABLE audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insert admin users
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [user.username, hash]);
  }

  console.log('Database seeded with 10 admin users.');
  await db.close();
}

seed();
