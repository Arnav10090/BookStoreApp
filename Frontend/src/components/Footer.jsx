import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 py-10 border-t border-black dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">

          {/* Company Info / Logo */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              BookStore
            </Link>
            <p className="text-sm">
              Your journey to knowledge starts here. Discover, learn, and grow with our curated collection of books.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/about" className="hover:text-pink-500 transition-colors duration-200">About Us</Link>
              <Link to="/books" className="hover:text-pink-500 transition-colors duration-200">Books</Link>
              <Link to="/contact" className="hover:text-pink-500 transition-colors duration-200">Contact</Link>
              <Link to="/privacy-policy" className="hover:text-pink-500 transition-colors duration-200">Privacy Policy</Link>
            </nav>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="https://x.com/bookstore" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
              </a>
              <a href="https://www.youtube.com/shorts/eTWnFZEZjVw" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg>
              </a>
              <a href="https://www.instagram.com/kidsbookstoreindia/" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.85-0.148 3.228-1.666 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.251-0.148-4.771-1.691-4.919-4.919-0.058-1.265-0.069-1.645-0.069-4.849 0-3.204.012-3.584.069-4.849 0.149-3.227 1.666-4.771 4.919-4.919 1.266-0.057 1.645-0.069 4.849-0.069zm0-2.163c-3.259 0-3.667.014-4.93.071-4.354.201-6.071 1.776-6.273 6.273-0.058 1.264-0.071 1.672-0.071 4.93s0.014 3.668 0.071 4.93c0.202 4.496 1.919 6.273 6.273 6.273 1.263 0 1.671-0.014 4.93-0.071 4.354-0.201 6.071-1.776 6.273-6.273 0.058-1.264 0.071-1.672 0.071-4.93s-0.014-3.668-0.071-4.93c-0.202-4.496-1.919-6.273-6.273-6.273zm0 6.607c-2.42 0-4.393 1.972-4.393 4.393s1.973 4.393 4.393 4.393 4.393-1.972 4.393-4.393c0-2.421-1.973-4.393-4.393-4.393zm0 7.271c-1.62 0-2.878-1.325-2.878-2.878 0-1.62 1.325-2.878 2.878-2.878s2.878 1.325 2.878 2.878c0 1.62-1.325 2.878-2.878 2.878zm5.539-9.882c-.663 0-1.201.538-1.201 1.201s.538 1.201 1.201 1.201c.663 0 1.201-.538 1.201-1.201s-.538-1.201-1.201-1.201z"></path></svg>
              </a>
            </div>
          </div>

          {/* Contact Info (Simple) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
            <p className="text-sm mb-2">Email: info@bookstore.com</p>
            <p className="text-sm">Phone: +1 (555) 123-4567</p>
          </div>

        </div>

        <div className="mt-8 pt-8 text-center text-sm">
          <p>Copyright © {new Date().getFullYear()} BookStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
