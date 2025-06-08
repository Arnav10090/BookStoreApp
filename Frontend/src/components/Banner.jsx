import React, { useState } from "react";
import banner from "/Banner.png";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";
import axiosInstance from "../axiosConfig";
import { useNavigate } from "react-router-dom";

function Banner() {
  const [email, setEmail] = useState("");
  const { authUser } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = async (e) => {
    e.preventDefault();
    if (!authUser) {
      toast.error("Login first to get started", { duration: 1500 });
      return;
    }

    try {
      const response = await axiosInstance.post("/users/check-email", { email });
      if (response.data.exists) {
        // Email is registered, proceed with existing logic (or redirect to login)
        console.log("Email submitted:", email);
        if (authUser) {
          navigate("/books");
          toast.success("Redirecting to books page.", { duration: 1500 });
        }
        // Here you might want to redirect to login or handle a successful 'get started' for an existing user
      } else {
        toast.error("Email not registered. Please sign up to continue.", { duration: 1500 });
      }
    } catch (error) {
      console.error("Error checking email:", error);
      toast.error("An error occurred. Please try again later.", { duration: 1500 });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 space-y-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-pink-500 leading-tight sm:leading-tight dark:text-pink-300">
              Hello, welcome to learn something{" "}
              <span>new everyday!!!</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Discover a world of knowledge and endless stories. BookStore offers a vast collection of books, from timeless classics to modern bestsellers, all curated to inspire and educate. Start your learning journey with us today!
            </p>
            <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row gap-4 w-full">
              <label className="flex-1">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </label>
              <button 
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Get Started
              </button>
            </form>
          </div>
          <div className="w-full md:w-1/2 mt-12 md:mt-0 md:pl-12 flex justify-center">
            <img
              src={banner}
              className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto"
              alt="Learning illustration"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
