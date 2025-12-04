// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Login() {
  const { login, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setErr(error.message || 'Failed to login');
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setErr(null);
    try {
      // import provider from api/firebase and pass to signInWithGoogle if you prefer
      // here we call the wrapper which uses default popup provider if wired
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      setErr(error.message || 'Google sign-in failed');
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '2rem auto' }}>
      <h2>Login</h2>
      {err && <div style={{ color: 'red' }}>{err}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Email</label><br />
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Password</label><br />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>

      <div style={{ marginTop: 12 }}>
        <button onClick={handleGoogle}>Sign in with Google</button>
      </div>

      <p style={{ marginTop: 12 }}>
        Don’t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
