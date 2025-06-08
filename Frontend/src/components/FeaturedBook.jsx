import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../axiosConfig"; // Import the configured axios instance
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSearch } from "../context/SearchProvider";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";
import BookCard from "./BookCard"; // Import the new BookCard component
import EditBookForm from "./EditBookForm"; // Import EditBookForm

function FeaturedBook() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBook, setEditingBook] = useState(null); // State for editing book
  const { searchTerm } = useSearch();
  const { authUser, isAuthenticated } = useAuth();

  const mobileSliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const getBooks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.get("/book"); // Use axiosInstance and relative path
      // Transform the data to match the expected format
      const formattedBooks = res.data.map(book => ({
        id: book._id,
        title: book.title || "Untitled Book",
        price: book.price ? book.price.toString() : "0",
        isFree: book.price === "0" || book.price === 0 || !book.price,
        image: book.image || "",
        category: book.category || "Uncategorized",
        author: book.author || "Unknown Author",
        buyingLink: book.buyingLink || "",
      }));
      setFeaturedBooks(formattedBooks);
      setError(null);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load featured books. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getBooks();
  }, [getBooks]);

  const handleBookUpdated = (updatedBook) => {
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
    setFeaturedBooks(prevBooks =>
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

  // Change: Always display the first 3 books if available, regardless of authentication or price
  const booksToDisplayOnHomepage = featuredBooks.slice(0, 3);

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 bg-white dark:bg-slate-900">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto relative z-10 bg-white dark:bg-slate-900">
            <div className="text-center mb-16 pt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-pink-300">Featured Books</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover our collection of high-quality books. Start learning today with our free and premium books.
              </p>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading featured books...</p>
              </div>
            ) : error && booksToDisplayOnHomepage.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => getBooks()} 
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {/* Mobile Slider */}
                <div className="block md:hidden">
                  <Slider {...mobileSliderSettings}>
                    {booksToDisplayOnHomepage
                      .filter(book => {
                        if (!searchTerm) return true; 
                        const lowerCaseSearchTerm = searchTerm.toLowerCase();
                        return (
                          book.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                          book.author.toLowerCase().includes(lowerCaseSearchTerm)
                        );
                      })
                      .map((book) => (
                        <div key={book.id} className="px-2">
                          <BookCard book={book} isMobile={true} />
                        </div>
                      ))}
                  </Slider>
                </div>
                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-3 md:gap-6">
                  {booksToDisplayOnHomepage
                    .filter(book => {
                      if (!searchTerm) return true; 
                      const lowerCaseSearchTerm = searchTerm.toLowerCase();
                      return (
                        book.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                        book.author.toLowerCase().includes(lowerCaseSearchTerm)
                      );
                    })
                    .map((book) => (
                      <div key={book.id} className="px-4">
                        <BookCard book={book} />
                      </div>
                    ))}
                </div>
              </>
            )}
            
            {editingBook && isAuthenticated && (
              <EditBookForm
                book={editingBook}
                onBookUpdated={handleBookUpdated}
                onCancel={handleCancelEdit}
              />
            )}

            <div className="mt-12 text-center">
              <Link to="/books" className="inline-block">
                <button className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300">
                  View All Books
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedBook;
