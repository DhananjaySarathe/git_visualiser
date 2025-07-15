import React from 'react';
import GitVisualizer from './components/GitVisualizer';
import { GitProvider } from './context/GitContext';

function App() {
  return (
    <GitProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Git Command Visualizer</h1>
                <p className="text-gray-400 text-sm">Learn Git through interactive command simulation</p>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6">
          <GitVisualizer />
        </main>
      </div>
    </GitProvider>
  );
}

export default App;