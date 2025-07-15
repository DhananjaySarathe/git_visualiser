import React from 'react';
import Terminal from './Terminal';
import CommitGraph from './CommitGraph';
import GitStatus from './GitStatus';
import CommandHistory from './CommandHistory';

const GitVisualizer: React.FC = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      {/* Left Panel - Terminal and Command History */}
      <div className="xl:col-span-4 space-y-4">
        <Terminal />
        <CommandHistory />
      </div>
      
      {/* Center Panel - Commit Graph */}
      <div className="xl:col-span-5">
        <CommitGraph />
      </div>
      
      {/* Right Panel - Git Status */}
      <div className="xl:col-span-3">
        <GitStatus />
      </div>
    </div>
  );
};

export default GitVisualizer;