// src/routes/AppRouter.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Discover from '../pages/Discover';
import Search from '../pages/Search';
import MoviePage from '../pages/MoviePage';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import Favourites from '../pages/Favourites';
import Profile from '../pages/Profile';
import useAuth from '../hooks/useAuth';
import Lists from '../pages/Lists';
import ListDetails from '../pages/ListDetails';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/search" element={<Search />} />
      <Route path="/movie/:id" element={<MoviePage isTV={false} />} />
      <Route path="/tv/:id" element={<MoviePage isTV={true} />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favourites"
        element={
          <ProtectedRoute>
            <Favourites />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/lists" element={<Lists />} />
      <Route path="/lists/:listId" element={<ListDetails />} />
    </Routes>
  );
}
