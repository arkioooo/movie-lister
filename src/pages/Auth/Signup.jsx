// src/pages/Auth/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Signup() {
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Form */}
        <div className="auth-form">
          <h2 className="auth-title">Create an account</h2>

          {error && <div style={{ color: 'red' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Creating...' : 'Sign up'}
            </button>
          </form>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleGoogle}
          >
            Sign up with Google
          </button>

          <div className="auth-alt">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>

        {/* Visual */}
        <div className="auth-visual">
          <div className="auth-visual-inner">
            <h3>Discover more</h3>
            <p>
              Track favourites, explore trending titles, and personalise your experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
