import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage when component mounts
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("Users");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedUser !== "undefined") { 
          setAuthUser(JSON.parse(storedUser));
        } else {
          setAuthUser(null);
        }

        if (storedToken && storedToken !== "undefined") {
          setToken(storedToken);
        } else {
          setToken(null);
        }

      } catch (error) {
        console.error("Error parsing auth user or token:", error);
        localStorage.removeItem("Users");
        localStorage.removeItem("token");
        setAuthUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Update localStorage whenever authUser or token changes
  useEffect(() => {
    if (authUser) {
      localStorage.setItem("Users", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("Users");
    }

    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [authUser, token]);

  const updateAuthUserAndToken = (userData, userToken) => {
    setAuthUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    setAuthUser(null);
    setToken(null);
    localStorage.removeItem("Users");
    localStorage.removeItem("token");
  };

  const value = {
    authUser,
    setAuthUser: updateAuthUserAndToken,
    isAuthenticated: !!authUser && !!token,
    loading,
    token,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? (
        children
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
