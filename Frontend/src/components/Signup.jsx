import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const { setAuthUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    // Log form data to console
    console.log("Form submitted with values:", {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
    });

    const userInfo = {
      fullname: data.fullname,
      email: data.email,
      password: data.password,
    };
    await axios
      .post("http://localhost:4000/users/signup", userInfo)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          toast.success("Signup Successfully! Try to Login Now");
          document.getElementById("my_modal_3").showModal();
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err);
          toast.error("Error: " + err.response.data.message);
        }
      });
  };
  return (
    <>
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-slate-900 overflow-hidden relative">
        {/* Background Decoration */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="w-full max-w-md p-1 relative z-10">
          <div className="modal-box w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-2xl border border-white/20 dark:border-gray-700 rounded-2xl p-8 transform transition-all">
            <form onSubmit={handleSubmit(onSubmit)} method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <Link
                to="/"
                className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={() => navigate(from, { replace: true })}
              >
                ✕
              </Link>

              <div className="text-center mb-8">
                <h3 className="font-extrabold text-3xl text-gray-800 dark:text-white mb-2">Create Account</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Join our community of book lovers</p>
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 ml-1">Full Name</label>
                <div className="relative flex items-center">
                  <FaUser className="absolute left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900 bg-white dark:bg-slate-900 text-gray-800 dark:text-white outline-none transition-all"
                    {...register("fullname", { required: true })}
                  />
                </div>
                {errors.fullname && (
                  <span className="text-xs text-red-500 mt-1 ml-1 font-semibold">
                    Name is required
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 ml-1">Email Address</label>
                <div className="relative flex items-center">
                  <FaEnvelope className="absolute left-3 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900 bg-white dark:bg-slate-900 text-gray-800 dark:text-white outline-none transition-all"
                    {...register("email", { required: true })}
                  />
                </div>
                {errors.email && (
                  <span className="text-xs text-red-500 mt-1 ml-1 font-semibold">
                    Email is required
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 ml-1">Password</label>
                <div className="relative flex items-center">
                  <FaLock className="absolute left-3 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900 bg-white dark:bg-slate-900 text-gray-800 dark:text-white outline-none transition-all"
                    {...register("password", { required: true })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-pink-500 transition-colors cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-xs text-red-500 mt-1 ml-1 font-semibold">
                    Password is required
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 ml-1">Confirm Password</label>
                <div className="relative flex items-center">
                  <FaLock className="absolute left-3 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900 bg-white dark:bg-slate-900 text-gray-800 dark:text-white outline-none transition-all"
                    {...register("confirmPassword", {
                      required: "This field is required",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-gray-400 hover:text-pink-500 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-xs text-red-500 mt-1 ml-1 font-semibold">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              {/* Button */}
              <div className="flex flex-col gap-4 mt-6">
                <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  Sign Up
                </button>
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Already have an account?{" "}
                  <button
                    className="font-bold text-pink-500 hover:text-pink-600 hover:underline cursor-pointer transition-colors"
                    onClick={() =>
                      document.getElementById("my_modal_3").showModal()
                    }
                  >
                    Login
                  </button>{" "}
                </div>
              </div>
            </form>
            <Login />
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
