import React from 'react';
import AppRouter from './routes/AppRouter';
import Navbar from './components/common/Navbar';

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <AppRouter />
      </main>
    </>
  );
}
