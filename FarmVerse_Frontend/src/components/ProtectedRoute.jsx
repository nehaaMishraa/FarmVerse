import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check if the authentication token exists in local storage.
  const token = localStorage.getItem('token');

  // If a token exists, the user is authenticated.
  // The <Outlet /> component will render the child route (our DashboardPage).
  // If not, redirect the user to the login page.
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;

