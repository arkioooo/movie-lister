// src/App.jsx
import React from 'react';
import AppRouter from './routes/AppRouter';
import Navbar from './components/common/Navbar';
import ThemeTogglePill from './components/common/ThemeTogglePill';
import AccountBubble from './components/common/AccountBubble';
import Footer from './components/common/Footer';
import { useEffect } from 'react';

export default function App() {
    useEffect(() => {
      function onScroll() {
        const wrap = document.querySelector('.floating-header-wrapper');
        if (!wrap) return;

        if (window.scrollY > 0) {
          wrap.classList.add('floating-header-scrolled');
        } else {
          wrap.classList.remove('floating-header-scrolled');
        }
      }

      window.addEventListener('scroll', onScroll);
      onScroll();

      return () => window.removeEventListener('scroll', onScroll);
    }, []);

  return (
    <div className="app-root">
      {/* nav-root */}
      <div className="floating-header-wrapper">
        <div className="floating-header">

          {/*theme toggle */}
          <div className="floating-left">
            <ThemeTogglePill />
          </div>

          {/*navbar */}
          <div className="floating-center">
            <Navbar />
          </div>

          {/*account bubble */}
          <div className="floating-right">
            <AccountBubble />
          </div>
        </div>
      </div>

      <main className="app-main">
        <AppRouter />
      </main>

      <Footer />
    </div>
  );
}

