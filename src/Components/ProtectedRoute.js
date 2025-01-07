import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => !!localStorage.getItem("token");

const ProtectedRoute = ({ children }) => {
  useEffect(() => {
    // Prevent caching for authenticated routes
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      if (!isAuthenticated()) {
        window.location.href = "/";
      }
    };
  }, []);

  return isAuthenticated() ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
