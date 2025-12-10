// src/pages/Home.jsx
import React from 'react';
import Discover from './Discover';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero section */}
      <section className="hero-section">
        <div className="hero-inner">
          <h1 className="hero-title">Find your next favourite movie or show.</h1>
          <p className="hero-body">
            Browse trending titles, build personal lists, and get tailored picks using data from TMDB.
            Sign in to save favourites, or explore as a guest.
          </p>
          <div className="hero-actions">
            <a href="#discover-section" className="hero-button-primary">Start discovering</a>
            <a href="/favourites" className="hero-button-secondary">View favourites</a>
          </div>
        </div>
      </section>

      {/* Discover section reusing existing Discover page logic */}
      <section id="discover-section" className="section-discover">
        <Discover />
      </section>
    </div>
  );
}
