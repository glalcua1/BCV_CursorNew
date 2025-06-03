import React from 'react';
import Analytics from './components/Analytics';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-6">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6">
        <Analytics />
      </main>
    </div>
  );
}

export default App; 