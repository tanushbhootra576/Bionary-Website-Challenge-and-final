import mongoose from "mongoose";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { User } from "./schema.js";

dotenv.config();

const { MONGO_DB_URI } = process.env;

// Admin credentials - change these before running
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123"; // Change this to a strong password

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_DB_URI);
    console.log("MongoDB connected");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: ADMIN_USERNAME });
    if (existingAdmin) {
      console.log(`Admin user '${ADMIN_USERNAME}' already exists!`);
      process.exit(0);
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);

    // Create admin user
    const admin = new User({
      username: ADMIN_USERNAME,
      password: hashedPassword,
    });

    await admin.save();
    console.log(`✅ Admin user '${ADMIN_USERNAME}' created successfully!`);
    console.log(`Username: ${ADMIN_USERNAME}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log("\n⚠️  Make sure to change the default password after first login!");

    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
