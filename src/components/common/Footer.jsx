import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();

  const iconColor = theme === 'dark' ? 'ffffff' : '111827';

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <footer className="footer-wrap">
      <div className="footer-inner">
        <div className="footer-card">
          <div className="footer-left">
            <div className="footer-brand">TMDB App</div>

            <div className="footer-social">
              <a href="#" className="social-pill">
                <img
                  src={`https://cdn.simpleicons.org/x/${iconColor}`}
                  alt="X"
                />
              </a>

              <a href="#" className="social-pill">
                <img
                  src={`https://cdn.simpleicons.org/instagram/${iconColor}`}
                  alt="Instagram"
                />
              </a>

              <a href="#" className="social-pill">
                <img
                  src={`https://cdn.simpleicons.org/github/${iconColor}`}
                  alt="GitHub"
                />
              </a>
            </div>

            <form className="footer-contact" onSubmit={handleSubmit}>
              <input
                className="footer-email-input"
                type="email"
                placeholder="example@email.com"
              />
              <button className="btn footer-email-btn" type="submit">
                Contact us
              </button>
            </form>
          </div>

          <div className="footer-right">
            <div className="footer-section-title">Company</div>
            <ul className="footer-links">
              <li><a href="#tos">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
