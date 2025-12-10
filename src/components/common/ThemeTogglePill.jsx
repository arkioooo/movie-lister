// src/components/common/ThemeTogglePill.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeTogglePill() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle-pill"
      onClick={toggleTheme}
      aria-pressed={theme === 'dark'}
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="theme-toggle-knob" aria-hidden="true" />
      <span className="theme-toggle-label">
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}
