import React from 'react';
import { History, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useGit } from '../context/GitContext';

const CommandHistory: React.FC = () => {
  const { state } = useGit();

  if (state.commandHistory.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <History className="h-5 w-5 text-amber-400" />
          <span>Command History</span>
        </h3>
        <div className="text-center py-4">
          <Clock className="h-8 w-8 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No commands executed yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <History className="h-5 w-5 text-amber-400" />
        <span>Command History</span>
        <span className="text-xs bg-amber-400 text-slate-900 px-2 py-1 rounded-full">
          {state.commandHistory.length}
        </span>
      </h3>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {state.commandHistory.slice(-10).map((item, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg border-l-4 ${
              item.error 
                ? 'bg-red-900/20 border-red-500' 
                : 'bg-slate-700 border-green-500'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              {item.error ? (
                <AlertCircle className="h-4 w-4 text-red-400" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-400" />
              )}
              <span className="font-mono text-sm text-white">
                {item.command}
              </span>
              <span className="text-xs text-gray-500 ml-auto">
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            {item.output && (
              <div className={`text-xs font-mono whitespace-pre-wrap ${
                item.error ? 'text-red-300' : 'text-gray-300'
              }`}>
                {item.output.length > 100 
                  ? item.output.slice(0, 100) + '...' 
                  : item.output
                }
              </div>
            )}
          </div>
        ))}
      </div>
      
      {state.commandHistory.length > 10 && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500">
            Showing last 10 commands of {state.commandHistory.length} total
          </span>
        </div>
      )}
    </div>
  );
};

export default CommandHistory;