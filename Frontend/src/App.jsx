import React from "react";
import Home from "./home/Home";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Books from "./components/Books";
import Signup from "./components/Signup";
import About from "./components/About";
import Contact from "./components/Contact";
import PrivacyPolicy from "./components/PrivacyPolicy";
import { Toaster } from "react-hot-toast";
import FloatingHomeButton from "./components/FloatingHomeButton";
import { useAuth } from "./context/AuthProvider";
import Login from "./components/Login";
import { SearchProvider } from "./context/SearchProvider";
import ScrollToTop from "./components/ScrollToTop";

// Protected Route component for authenticated routes
function ProtectedRoute({ children }) {
  const context = useAuth();
  const location = useLocation();

  if (context.loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!context.isAuthenticated) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  return children;
}

// Public Route component for non-authenticated routes
function PublicRoute({ children }) {
  const context = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/books";

  if (context.loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (context.isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return children;
}

function App() {
  // const location = useLocation(); // Removed conditional rendering logic
  // const hideNavAndFooter = location.pathname === "/login" || location.pathname === "/signup"; // Removed conditional rendering logic

  return (
    <div className="bg-white dark:bg-slate-900 dark:text-white min-h-screen overflow-x-hidden">
      <Toaster position="top-right" />
      <SearchProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <Books />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {/* Revert login route to only be handled by the modal, not a separate route */}
          {/* <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          /> */}
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
        </Routes>
      </SearchProvider>
      <FloatingHomeButton />
    </div>
  );
}

export default App;
