import React, { useState, useEffect } from 'react';

const BookCard = ({ book, isMobile = false, onEditClick }) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false); // Reset imageError when book.image changes
  }, [book.image]);

  return (
    <div className={`${isMobile ? 'px-2' : ''} bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 min-h-full flex flex-col`}>
      <div className="p-4 sm:p-6 bg-blue-50 dark:bg-slate-800 flex-shrink-0">
        <div className="relative">
          <div className="w-full h-32 sm:h-40 bg-blue-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            {(book.image && !imageError) ? (
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover rounded-lg"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-200 dark:bg-slate-500 rounded-full flex items-center justify-center mb-2">
                  <svg
                    className="w-8 h-8 text-blue-600 dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
            )}
            {book.isFree && (
              <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Free
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 flex-shrink-0">
          {book.title}
        </h3>
        <div className="overflow-hidden flex-shrink-0">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {book.category && <p className="line-clamp-1 mb-0"><span className="font-medium">Category:</span> {book.category}</p>}
            {book.author && <p className="line-clamp-1 mb-0"><span className="font-medium">Author:</span> {book.author}</p>}
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 h-[52px] flex-shrink-0">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${book.price}
          </span>
          <div className="flex space-x-2 ml-2">
            {onEditClick && !book.id.toString().startsWith('default-') && (
              <button
                onClick={() => onEditClick(book)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-full transition-colors duration-300"
              >
                Edit
              </button>
            )}
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors duration-300" onClick={() => {
              if (book.buyingLink) {
                window.open(book.buyingLink, '_blank');
              } else {
                alert('No buying link available for this book.');
              }
            }}>
              {book.isFree ? "Get Now" : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard; 