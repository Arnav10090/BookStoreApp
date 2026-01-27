import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log('Login form submitted with values:', {
      email: data.email,
      password: data.password
    });

    const userInfo = {
      email: data.email,
      password: data.password,
    };
    await axios
      .post("http://localhost:4000/users/login", userInfo)
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          toast.success("Loggedin Successfully");
          document.getElementById("my_modal_3").close();
          const { token, ...userData } = res.data;
          setAuthUser(userData, token);
          navigate("/books");
        }
      })
      .catch((err) => {
        if (err.response) {
          console.log(err);
          toast.error("Error: " + err.response.data.message);
          setTimeout(() => { }, 2000);
        }
      });
  };
  return (
    <div>
      <dialog id="my_modal_3" className="modal backdrop-blur-sm">
        <div className="modal-box relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-2xl border border-white/20 dark:border-gray-700 rounded-2xl p-8 max-w-md w-full">
          <form onSubmit={handleSubmit(onSubmit)} method="dialog">
            <Link
              to="/"
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => document.getElementById("my_modal_3").close()}
            >
              ✕
            </Link>

            <div className="text-center mb-6">
              <h3 className="font-extrabold text-3xl text-gray-800 dark:text-white mb-2">Welcome Back</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Login to access your library</p>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 ml-1">Email</label>
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
            <div className="mb-6">
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

            <div className="flex flex-col gap-4 mt-8">
              <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                Login
              </button>
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                Not registered?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-pink-500 hover:text-pink-600 hover:underline cursor-pointer transition-colors"
                >
                  Signup
                </Link>{" "}
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default Login;
