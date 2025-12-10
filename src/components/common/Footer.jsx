// src/components/common/Footer.jsx
import React from 'react';

export default function Footer() {
  function handleSubmit(e) {
    e.preventDefault(); // no real backend yet
  }

  return (
    <footer className="footer-wrap">
      <div className="footer-inner">
        <div className="footer-card">
          {/* Left side: brand, socials, email pill */}
          <div className="footer-left">
            <div className="footer-brand">MOVIE LISTER</div>

              <div className="footer-social">
                <a href="#" className="social-pill">
                  <img src="https://cdn.simpleicons.org/x/ffffff" alt="X" />
                </a>

                <a href="#" className="social-pill">
                  <img src="https://cdn.simpleicons.org/instagram/ffffff" alt="Instagram" />
                </a>

                <a href="#" className="social-pill">
                  <img src="https://cdn.simpleicons.org/github/ffffff" alt="GitHub" />
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

          {/* Right side: company links */}
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
