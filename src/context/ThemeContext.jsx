// src/context/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'dark', // default
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    // apply class to <html> so CSS variables switch
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
