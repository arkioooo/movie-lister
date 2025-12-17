// src/components/common/AccountBubble.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function AccountBubble() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  // Close on outside click or Escape
  useEffect(() => {
    function onDocClick(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  async function handleLogout() {
    const ok = window.confirm('Are you sure you want to logout?');
    if (!ok) return;
    try {
      await logout();
      setOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  }

  // Signed-out view: primary Login, secondary Sign up
  if (!user) {
    return (
      <div className="account-bubble account-bubble-guest" ref={rootRef}>
        <Link to="/login" className="btn btn-primary btn-small" aria-label="Login">
          Login
        </Link>
        <Link to="/signup" className="btn btn-secondary btn-small" aria-label="Sign up">
          Sign up
        </Link>
      </div>
    );
  }

  const displayName = user.displayName || user.email || '';
  const initial = displayName.trim()[0]?.toUpperCase() || 'U';

  return (
    <div className="account-bubble account-bubble-auth" ref={rootRef}>
      <button
        className={`account-inner ${open ? 'open' : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Open account menu"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span className="account-initial" title={displayName || 'Account'}>
          {initial}
        </span>
      </button>

      {/* Animated dropdown */}
      <div
        className={`account-dropdown ${open ? 'show' : ''}`}
        role="menu"
        aria-label="Account menu"
      >
        <button
          type="button"
          className="account-dropdown-item"
          onClick={() => { setOpen(false); navigate('/profile'); }}
          role="menuitem"
        >
          Profile
        </button>

        <button
          type="button"
          className="account-dropdown-item"
          onClick={handleLogout}
          role="menuitem"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
