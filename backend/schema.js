import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
})

export const User = mongoose.model('user',UserSchema)

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date || String,
  time: Date || String,
  location: String,
  capacity: Number,
  registered: Number,
  type: String,
  image: String,
  tags: String,
  featured: Boolean,
});

export const Event = mongoose.model('Event', EventSchema)

const GallerySchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  date: Date || String,
  category: String,
  tags: String,
});

export const Gallery = mongoose.model('Gallery',GallerySchema)

const LeaderboardSchema = new mongoose.Schema({
  name: String,
  score: Number,
  department: String,
});

export const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema)

export const BlogSchema = new mongoose.Schema({
  title: String,
  author: String,
  body: String,
  tags: String,
  date: Date || String,
  image: String,
});

export const Blog = mongoose.model('Blog', BlogSchema)

const DepartmentSchema = mongoose.Schema({
    name: String,
    description: String,
    type: String,
    image: String,
    leads: [{
        name: String,
        title: String,
        image: String
    }]
})

export const Department = mongoose.model('Department', DepartmentSchema)