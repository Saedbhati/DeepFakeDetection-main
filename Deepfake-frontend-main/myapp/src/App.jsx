import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/Homepage';
import DetectPage from './components/Detectpage';
import LoginPage from './components/Loginpage';
import Features from './components/Features';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detect" element={<DetectPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/features" element={<Features />} />
      </Routes>
    </div>
  );
};

export default App;