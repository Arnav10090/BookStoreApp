import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuth } from "../context/AuthProvider";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AddBookForm from "./AddBookForm";
import EditBookForm from "./EditBookForm";
import BookCard from "./BookCard";
import toast from "react-hot-toast";
import defaultBooksData from "../data/books.json";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [viewMode, setViewMode] = useState("default"); // "default" or "personalized"
  const { authUser, isAuthenticated } = useAuth();

  const [displayLimit, setDisplayLimit] = useState("All");

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get("/book");

      if (!response.data) {
        throw new Error("No data received from server");
      }

      // Transform the data to match the expected format
      const formattedBooks = response.data.map((book) => ({
        id: book._id,
        title: book.title || "Untitled Book",
        price: book.price ? book.price.toString() : "0",
        category: book.category || "Uncategorized",
        image: book.image || "",
        isFree: book.price === "0" || book.price === 0 || !book.price,
        author: book.author || "Unknown Author",
        buyingLink: book.buyingLink || "",
      }));

      setBooks(formattedBooks);
      setError(null);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError(
        `Failed to load books. ${err.response?.data?.message ||
        err.message ||
        "Please try again later."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBookAdded = (newBook) => {
    // Add the new book to the list
    const formattedBook = {
      id: newBook._id,
      title: newBook.title || "Untitled Book",
      price: newBook.price ? newBook.price.toString() : "0",
      category: newBook.category || "Uncategorized",
      image: newBook.image || "",
      isFree: newBook.price === "0" || newBook.price === 0 || !newBook.price,
      author: newBook.author || "Unknown Author",
      buyingLink: newBook.buyingLink || "",
    };
    setBooks(prevBooks => [formattedBook, ...prevBooks]);
    setShowAddForm(false);
    toast.success('Book added successfully!');
  };

  const handleBookUpdated = (updatedBook) => {
    // Update the book in the list
    const formattedBook = {
      id: updatedBook._id,
      title: updatedBook.title || "Untitled Book",
      price: updatedBook.price ? updatedBook.price.toString() : "0",
      category: updatedBook.category || "Uncategorized",
      image: updatedBook.image || "",
      isFree: updatedBook.price === "0" || updatedBook.price === 0 || !updatedBook.price,
      author: updatedBook.author || "Unknown Author",
      buyingLink: updatedBook.buyingLink || "",
    };
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === formattedBook.id ? formattedBook : book
      )
    );
    setEditingBook(null);
  };

  const handleEditClick = (book) => {
    setEditingBook(book);
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
  };

  const handleBookDeleted = (deletedBookId) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== deletedBookId));
    setEditingBook(null); // Close the edit form after deletion
    toast.success('Book deleted successfully!');
  };

  // Format default books from books.json (first 20)
  const defaultBooks = defaultBooksData.slice(0, 20).map((book, index) => ({
    id: `default-${index}`,
    title: book.title,
    price: book.price.toString(),
    category: book.category,
    image: book.imageUrl,
    isFree: book.price === 0,
    author: book.author,
    buyingLink: book.buyingLink,
  }));

  // Determine which books to display based on view mode
  let allBooks = viewMode === "default"
    ? defaultBooks
    : (isAuthenticated ? books : books.filter(book => book.isFree));

  // Apply limit filter
  const displayedBooks = displayLimit === "All" ? allBooks : allBooks.slice(0, parseInt(displayLimit));

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-16 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading books...</p>
            </div>
          </div>
        ) : error && displayedBooks.length === 0 ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => setError(null) || fetchBooks()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto py-10">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {viewMode === "default" ? "Featured Books" : "Your Personalized Collection"}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                {viewMode === "default"
                  ? "Discover our curated collection of must-read books. Start your reading journey today!"
                  : "Manage your personal book collection. Add, edit, and organize your favorite books."
                }
              </p>

              {/* Controls Container */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
                {/* Limit Filter */}
                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <label className="text-gray-600 dark:text-gray-300 font-semibold whitespace-nowrap px-2">Show:</label>
                  <select
                    value={displayLimit}
                    onChange={(e) => setDisplayLimit(e.target.value)}
                    className="select select-bordered select-md bg-gray-50 dark:bg-slate-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-md px-4 font-medium min-w-[100px]"
                  >
                    <option value="6">6</option>
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="All">All</option>
                  </select>
                </div>

                {viewMode === "personalized" && isAuthenticated && (
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                  >
                    {showAddForm ? 'Cancel' : 'Add New Book'}
                  </button>
                )}
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      setViewMode(viewMode === "default" ? "personalized" : "default");
                      setShowAddForm(false);
                      setEditingBook(null);
                    }}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                  >
                    {viewMode === "default" ? "Your Personalized Collection" : "View Featured Books"}
                  </button>
                )}
              </div>
            </div>

            {showAddForm && isAuthenticated && (
              <div className="mb-12">
                <AddBookForm onBookAdded={handleBookAdded} />
              </div>
            )}

            {editingBook && (
              <EditBookForm
                book={editingBook}
                onBookUpdated={handleBookUpdated}
                onBookDeleted={handleBookDeleted}
                onCancel={handleCancelEdit}
              />
            )}

            <div className="mt-12">
              {displayedBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 hidden md:grid">
                  {displayedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex justify-center"
                    >
                      <BookCard book={book} onEditClick={handleEditClick} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-700 dark:text-gray-400 text-lg">No books found.</p>
              )}

              {/* Mobile Carousel */}
              <div className="block md:hidden">
                <Slider {...sliderSettings}>
                  {displayedBooks.length > 0 ? (
                    displayedBooks.map((book) => (
                      <div
                        key={book.id}
                        className="flex justify-center"
                      >
                        <BookCard book={book} isMobile={true} onEditClick={handleEditClick} />
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-700 dark:text-gray-400 text-lg">No books found.</p>
                  )}
                </Slider>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Books;
