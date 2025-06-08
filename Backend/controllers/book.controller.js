import Book from "../model/book.model.js";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getBook = async (req, res) => {
    try {
        console.log('Fetching books from database...');
        const books = await Book.find({});
        console.log(`Found ${books.length} books`);
        if (books.length === 0) {
            console.log('No books found in the database. Please check if the database has been seeded.');
        }
        res.status(200).json(books);
    } catch (error) {
        console.error('Error in getBook controller:', error);
        res.status(500).json({ 
            error: 'Failed to fetch books',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

export const createBook = async (req, res) => {
    try {
        const {
            title,
            author,
            price,
            category,
            buyingLink,
            remoteImageUrl,
        } = req.body;

        if (!title || !author || !price) {
            return res.status(400).json({
                message: "Title, author, and price are required fields.",
            });
        }

        // Construct image URL: prioritize URL from form, then uploaded file
        let imageUrl = "";
        if (remoteImageUrl && typeof remoteImageUrl === 'string' && (remoteImageUrl.startsWith("http://") || remoteImageUrl.startsWith("https://"))) {
            imageUrl = remoteImageUrl;
        } else if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const newBook = new Book({
            title,
            author,
            price,
            category: category || "Uncategorized",
            image: imageUrl,
            buyingLink: buyingLink || "",
            user: req.user?._id || null,
        });

        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        console.error("Error creating book:", error);
        res.status(500).json({
            message: error.message,
        });
    }
};

export const updateBook = async (req, res) => {
    try {
        console.log('--- Incoming Update Book Request ---');
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);
        console.log('req.files:', req.files);

        const { id } = req.params;
        const {
            title,
            author,
            price,
            category,
            buyingLink,
            remoteImageUrl,
        } = req.body;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        // Handle image update: prioritize URL from form, then uploaded file
        let imageUrl = book.image; // Keep existing image by default
        if (remoteImageUrl && typeof remoteImageUrl === 'string' && (remoteImageUrl.startsWith("http://") || remoteImageUrl.startsWith("https://"))) {
            // If a new URL is provided, and the old image was a local upload, delete the old local image
            if (book.image && book.image.startsWith("/uploads/")) {
                const oldImagePath = path.join(__dirname, "..", book.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlink(oldImagePath, (err) => {
                        if (err) console.error("Failed to delete old image:", err);
                    });
                }
            }
            imageUrl = remoteImageUrl;
        } else if (req.file) {
            // If a new file is uploaded, delete the old image (local or URL)
            if (book.image && book.image !== "" && book.image.startsWith("/uploads/")) {
                const oldImagePath = path.join(__dirname, "..", book.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlink(oldImagePath, (err) => {
                        if (err) console.error("Failed to delete old image:", err);
                    });
                }
            }
            imageUrl = `/uploads/${req.file.filename}`;
        } else if (remoteImageUrl === "") { // Handle case where image is explicitly cleared (empty string from frontend)
            if (book.image && book.image.startsWith("/uploads/")) {
                const oldImagePath = path.join(__dirname, "..", book.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlink(oldImagePath, (err) => {
                        if (err) console.error("Failed to delete old image:", err);
                    });
                }
            }
            imageUrl = "";
        }

        // Validate required fields
        if (!title || !author || !price) {
            return res.status(400).json({
                message: "Title, author, and price are required fields.",
            });
        }

        book.title = title;
        book.author = author;
        book.price = price;
        book.category = category || "Uncategorized";
        book.image = imageUrl;
        book.buyingLink = buyingLink || "";

        const updatedBook = await book.save();
        res.status(200).json(updatedBook);
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({
            message: error.message,
        });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        // If the book has a locally stored image, delete it from the uploads folder
        if (book.image && book.image.startsWith("/uploads/")) {
            const imagePath = path.join(__dirname, "..", book.image);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) console.error("Failed to delete associated image file:", err);
                });
            }
        }

        await Book.findByIdAndDelete(id);
        res.status(200).json({
            message: "Book deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({
            message: error.message,
        });
    }
}; 