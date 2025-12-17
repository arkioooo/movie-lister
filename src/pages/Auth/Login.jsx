// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Login() {
  const { login, signInWithGoogle } = useAuth();
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
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
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
          <h2 className="auth-title">Welcome back</h2>

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
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleGoogle}
          >
            Continue with Google
          </button>

          <div className="auth-alt">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>

        {/* Visual */}
        <div className="auth-visual">
          <div className="auth-visual-inner">
            <h3>Your movie space</h3>
            <p>
              Save favourites, build lists, and discover movies tailored to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
