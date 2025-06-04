import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <nav className="space-x-4">
                <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Analytics</Link>
                <Link to="/settings" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Settings</Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 px-6">
          <Routes>
            <Route path="/" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 