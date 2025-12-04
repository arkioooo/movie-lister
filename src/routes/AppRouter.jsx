// src/routes/AppRouter.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Discover from '../pages/Discover';
import Search from '../pages/Search';
import MoviePage from '../pages/MoviePage';
import Home from '../pages/Home'; // optional: can render Discover
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Discover />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/search" element={<Search />} />
      <Route path="/movie/:id" element={<MoviePage isTV={false} />} />
      <Route path="/tv/:id" element={<MoviePage isTV={true} />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <div>Profile page (placeholder) — protected route</div>
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
