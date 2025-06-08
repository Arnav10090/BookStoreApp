import express from "express";
const router = express.Router();

import { getBook, createBook, updateBook, deleteBook } from "../controllers/book.controller.js";
import upload from "../middleware/upload.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

// Public routes
router.get("/", getBook);

// Protected routes
router.use(authMiddleware);
router.post("/", upload.single('image'), createBook);
router.put("/:id", upload.single('image'), updateBook);
router.delete("/:id", deleteBook);

export default router; 