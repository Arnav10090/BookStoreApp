import express from "express";
import cors from "cors";
const app = express();

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bookRoute from "./routes/book.route.js";
import userRoutes from './routes/user.routes.js';
import contactFormRoute from "./routes/contactForm.route.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 4001;
const URL = process.env.MONGO_URL || "mongodb://localhost:27017/bookstore";

// Enable CORS
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
import fs from 'fs';
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

//defining routes
app.use('/users', userRoutes);
app.use("/contact", contactFormRoute);
app.use("/book", bookRoute);

// Connect to MongoDB
mongoose
  .connect(URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
