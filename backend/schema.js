import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

export const User = mongoose.model('User', UserSchema);

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: String,
  time: String,
  location: String,
  capacity: { type: Number, default: 0 },
  registered: { type: Number, default: 0 },
  type: String,
  image: String,
  tags: String,
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export const Event = mongoose.model('Event', EventSchema);

const GallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  date: String,
  category: String,
  tags: String,
}, { timestamps: true });

export const Gallery = mongoose.model('Gallery', GallerySchema);

const LeaderboardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true, default: 0 },
  department: String,
}, { timestamps: true });

export const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema);

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  body: String,
  tags: String,
  date: String,
  image: String,
}, { timestamps: true });

export const Blog = mongoose.model('Blog', BlogSchema);

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  type: String,
  image: String,
  leads: [{
    name: String,
    title: String,
    image: String
  }]
}, { timestamps: true });

export const Department = mongoose.model('Department', DepartmentSchema);

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  department: String,
  batch: String,
  bio: String,
  skills: [String],
  points: { type: Number, default: 0 },
  image: String,
  github: String,
  linkedin: String,
  email: String,
}, { timestamps: true });

export const Team = mongoose.model('Team', TeamMemberSchema);
