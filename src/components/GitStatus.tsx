import React from 'react';
import { FileText, GitBranch, Clock, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { useGit } from '../context/GitContext';

const GitStatus: React.FC = () => {
  const { state } = useGit();

  if (!state.initialized) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-6 h-full">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-400" />
          <span>Repository Status</span>
        </h3>
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
          <p className="text-gray-400">No repository initialized</p>
          <p className="text-sm text-gray-500 mt-2">Run 'git init' to get started</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'added': return <Plus className="h-3 w-3 text-green-400" />;
      case 'modified': return <FileText className="h-3 w-3 text-yellow-400" />;
      case 'deleted': return <AlertTriangle className="h-3 w-3 text-red-400" />;
      default: return <FileText className="h-3 w-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'added': return 'text-green-400';
      case 'modified': return 'text-yellow-400';
      case 'deleted': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-6 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
        <FileText className="h-5 w-5 text-blue-400" />
        <span>Repository Status</span>
      </h3>
      
      <div className="space-y-6">
        {/* Current Branch/HEAD */}
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <GitBranch className="h-4 w-4 text-green-400" />
            <span className="text-gray-300 font-medium">Current State</span>
          </div>
          {state.detachedHead ? (
            <div className="text-sm">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertTriangle className="h-3 w-3" />
                <span>Detached HEAD</span>
              </div>
              <div className="text-gray-400 mt-1">
                At commit: {state.head.slice(0, 7)}
              </div>
            </div>
          ) : (
            <div className="text-white font-medium">{state.currentBranch}</div>
          )}
        </div>

        {/* Commit Count */}
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-purple-400" />
            <span className="text-gray-300 font-medium">Commits</span>
          </div>
          <div className="text-white font-medium">{state.commits.length}</div>
        </div>
        
        {/* Staged Files */}
        {state.staged.length > 0 && (
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-green-400 font-medium">Staged Files</span>
              <span className="text-xs bg-green-400 text-slate-900 px-2 py-1 rounded-full">
                {state.staged.length}
              </span>
            </div>
            <div className="space-y-2">
              {state.staged.map(file => (
                <div key={file.name} className="flex items-center space-x-2 text-sm">
                  {getStatusIcon(file.status)}
                  <span className={getStatusColor(file.status)}>{file.status}:</span>
                  <span className="text-gray-300">{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Working Directory */}
        {state.workingDir.length > 0 && (
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <span className="text-yellow-400 font-medium">Untracked Files</span>
              <span className="text-xs bg-yellow-400 text-slate-900 px-2 py-1 rounded-full">
                {state.workingDir.length}
              </span>
            </div>
            <div className="space-y-2">
              {state.workingDir.map(file => (
                <div key={file.name} className="flex items-center space-x-2 text-sm">
                  {getStatusIcon(file.status)}
                  <span className={getStatusColor(file.status)}>{file.status}:</span>
                  <span className="text-gray-300">{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* All Branches */}
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <GitBranch className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 font-medium">All Branches</span>
            <span className="text-xs bg-blue-400 text-slate-900 px-2 py-1 rounded-full">
              {state.branches.length}
            </span>
          </div>
          <div className="space-y-2">
            {state.branches.map(branch => (
              <div key={branch.name} className="flex items-center space-x-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: branch.color }}
                ></div>
                <span className={
                  branch.name === state.currentBranch && !state.detachedHead
                    ? 'text-green-400 font-medium' 
                    : 'text-gray-300'
                }>
                  {branch.name === state.currentBranch && !state.detachedHead ? '* ' : '  '}
                  {branch.name}
                </span>
                {branch.commit && (
                  <span className="text-xs text-gray-500">
                    ({branch.commit.slice(0, 7)})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Commits */}
        {state.commits.length > 0 && (
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-4 w-4 text-purple-400" />
              <span className="text-purple-400 font-medium">Recent Commits</span>
            </div>
            <div className="space-y-3">
              {state.commits.slice(-3).reverse().map(commit => (
                <div key={commit.id} className="border-l-2 border-purple-400 pl-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-mono text-gray-400">
                      {commit.id.slice(0, 7)}
                    </span>
                    {commit.isMerge && (
                      <span className="text-xs bg-amber-500 text-slate-900 px-1 rounded">
                        MERGE
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-white mb-1">{commit.message}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(commit.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clean State */}
        {state.staged.length === 0 && state.workingDir.length === 0 && state.commits.length > 0 && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-green-400 font-medium">Working tree clean</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Nothing to commit, working directory clean
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitStatus;