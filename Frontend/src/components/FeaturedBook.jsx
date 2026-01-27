import React, { useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSearch } from "../context/SearchProvider";
import { useAuth } from "../context/AuthProvider";
import BookCard from "./BookCard";
import defaultBooksData from "../data/books.json";

function FeaturedBook() {
  const { searchTerm } = useSearch();
  const { authUser } = useAuth();

  const desktopSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const mobileSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Format default books from books.json (only first 10, or 3 if guest)
  const maxBooks = authUser ? 10 : 3;
  const defaultBooks = defaultBooksData.slice(0, maxBooks).map((book, index) => ({
    id: `default-${index}`,
    title: book.title,
    price: book.price.toString(),
    category: book.category,
    image: book.imageUrl,
    isFree: book.price === 0,
    author: book.author,
    buyingLink: book.buyingLink,
  }));

  // Filter books based on search term
  const filteredBooks = defaultBooks.filter(book => {
    if (!searchTerm) return true;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      book.author.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 bg-white dark:bg-slate-900">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto relative z-10 bg-white dark:bg-slate-900">
            <div className="text-center mb-16 pt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-pink-300">Featured Books</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Discover our curated collection of must-read books. Start your reading journey today!
              </p>
            </div>

            {/* Mobile Slider */}
            <div className="block md:hidden">
              <Slider {...mobileSliderSettings}>
                {filteredBooks.map((book) => (
                  <div key={book.id} className="px-2">
                    <BookCard book={book} isMobile={true} />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Desktop Slider */}
            <div className="hidden md:block">
              <Slider {...desktopSliderSettings}>
                {filteredBooks.map((book) => (
                  <div key={book.id} className="px-4">
                    <BookCard book={book} />
                  </div>
                ))}
              </Slider>
            </div>

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
