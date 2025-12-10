// src/components/common/AccountBubble.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function AccountBubble() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (e) {
      console.error('Logout error', e);
    }
  }

  if (!user) {
    return (
      <Link to="/login" className="account-bubble account-bubble-guest">
        <span className="account-initial"></span>
      </Link>
    );
  }

  const displayName = user.displayName || user.email || '';
  const initial = displayName.trim()[0]?.toUpperCase() || 'U';

  return (
    <div className="account-bubble account-bubble-auth">
      <Link to="/profile" className="account-inner">
        <span className="account-initial">{initial}</span>
      </Link>
    </div>
  );
}
