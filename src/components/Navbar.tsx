import React from 'react';
import { GitBranch, Map } from 'lucide-react';

interface NavbarProps {
  activeTab: 'visualizer' | 'mindmap';
  setActiveTab: (tab: 'visualizer' | 'mindmap') => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <GitBranch className="h-8 w-8 text-purple-400" />
            <h1 className="text-xl font-bold text-white">Git Learning Platform</h1>
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'visualizer'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <GitBranch className="h-4 w-4" />
              <span>Git Visualizer</span>
            </button>
            
            <button
              onClick={() => setActiveTab('mindmap')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'mindmap'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <Map className="h-4 w-4" />
              <span>Mind Map</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;