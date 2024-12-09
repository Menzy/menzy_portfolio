import React from 'react';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Brands from './components/Brands';
import Contact from './components/Contact';

function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Stats />
      <Brands />
      <Contact />
    </div>
  );
}

export default App;