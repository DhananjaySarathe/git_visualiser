import React, { useMemo } from 'react';
import { GitCommit as GitCommitIcon, GitBranch, AlertCircle } from 'lucide-react';
import { useGit, GitCommit } from '../context/GitContext';

interface CommitPosition {
  x: number;
  y: number;
  commit: GitCommit;
  branchIndex: number;
}

const CommitGraph: React.FC = () => {
  const { state } = useGit();

  const commitPositions = useMemo(() => {
    if (!state.initialized || state.commits.length === 0) return [];

    const positions: CommitPosition[] = [];
    const branchLanes: { [branchName: string]: number } = {};
    let nextLane = 0;

    // Assign lanes to branches
    state.branches.forEach(branch => {
      if (!(branch.name in branchLanes)) {
        branchLanes[branch.name] = nextLane++;
      }
    });

    // Position commits
    state.commits.forEach((commit, index) => {
      const branchIndex = branchLanes[commit.branch] || 0;
      positions.push({
        x: 80 + (index * 120),
        y: 80 + (branchIndex * 80),
        commit,
        branchIndex,
      });
    });

    return positions;
  }, [state.commits, state.branches]);

  if (!state.initialized) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-8 h-full flex items-center justify-center">
        <div className="text-center">
          <GitBranch className="h-16 w-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Git Repository</h3>
          <p className="text-gray-400 mb-4">Run 'git init' to initialize a repository</p>
          <div className="text-sm text-gray-500">
            <p>Try these commands to get started:</p>
            <div className="mt-2 space-y-1 font-mono">
              <div>$ git init</div>
              <div>$ touch index.html</div>
              <div>$ git add .</div>
              <div>$ git commit -m "Initial commit"</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.commits.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-8 h-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Commits Yet</h3>
          <p className="text-gray-400 mb-4">Create your first commit to see the graph</p>
          <div className="text-sm text-gray-500">
            <p>Add some files and commit them:</p>
            <div className="mt-2 space-y-1 font-mono">
              <div>$ git add .</div>
              <div>$ git commit -m "First commit"</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const svgWidth = Math.max(800, commitPositions.length * 120 + 160);
  const svgHeight = Math.max(400, state.branches.length * 80 + 160);

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
          <GitCommitIcon className="h-6 w-6 text-purple-400" />
          <span>Commit Graph</span>
        </h2>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-300">HEAD</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-gray-300">Merge</span>
          </div>
          {state.detachedHead && (
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-3 h-3 text-red-400" />
              <span className="text-red-400">Detached HEAD</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <svg 
          className="w-full h-full" 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ minWidth: `${svgWidth}px`, minHeight: `${svgHeight}px` }}
        >
          {/* Branch lines */}
          {state.branches.map((branch, branchIndex) => (
            <line
              key={branch.name}
              x1={40}
              y1={80 + (branchIndex * 80)}
              x2={svgWidth - 40}
              y2={80 + (branchIndex * 80)}
              stroke={branch.color}
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.3"
            />
          ))}
          
          {/* Commit connections */}
          {commitPositions.map((pos, index) => {
            const commit = pos.commit;
            
            // Regular parent connection
            if (commit.parent) {
              const parentPos = commitPositions.find(p => p.commit.id === commit.parent);
              if (parentPos) {
                return (
                  <line
                    key={`${commit.id}-parent`}
                    x1={parentPos.x}
                    y1={parentPos.y}
                    x2={pos.x}
                    y2={pos.y}
                    stroke="#8B5CF6"
                    strokeWidth="3"
                  />
                );
              }
            }
            
            // Merge commit connections
            if (commit.isMerge && commit.parents) {
              return commit.parents.map((parentId, pIndex) => {
                const parentPos = commitPositions.find(p => p.commit.id === parentId);
                if (parentPos) {
                  return (
                    <line
                      key={`${commit.id}-merge-${pIndex}`}
                      x1={parentPos.x}
                      y1={parentPos.y}
                      x2={pos.x}
                      y2={pos.y}
                      stroke={pIndex === 0 ? "#8B5CF6" : "#F59E0B"}
                      strokeWidth="3"
                      strokeDasharray={pIndex === 0 ? "none" : "8,4"}
                    />
                  );
                }
                return null;
              });
            }
            
            return null;
          })}
          
          {/* Commits */}
          {commitPositions.map((pos) => {
            const commit = pos.commit;
            const isHead = commit.id === state.head;
            const branch = state.branches.find(b => b.name === commit.branch);
            const commitColor = commit.isMerge ? "#F59E0B" : (branch?.color || "#10B981");
            
            return (
              <g key={commit.id}>
                {/* Commit circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="18"
                  fill={commitColor}
                  stroke={isHead ? "#A855F7" : commitColor}
                  strokeWidth={isHead ? "4" : "2"}
                  className="transition-all duration-300"
                />
                
                {/* Commit hash */}
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  className="fill-white text-xs font-bold"
                >
                  {commit.id.slice(0, 3)}
                </text>
                
                {/* Commit message */}
                <text
                  x={pos.x}
                  y={pos.y + 40}
                  textAnchor="middle"
                  className="fill-gray-300 text-xs"
                  style={{ maxWidth: '100px' }}
                >
                  {commit.message.length > 15 ? commit.message.slice(0, 15) + '...' : commit.message}
                </text>
                
                {/* HEAD indicator */}
                {isHead && (
                  <>
                    <rect
                      x={pos.x - 20}
                      y={pos.y - 35}
                      width="40"
                      height="16"
                      rx="8"
                      fill="#A855F7"
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 25}
                      textAnchor="middle"
                      className="fill-white text-xs font-bold"
                    >
                      HEAD
                    </text>
                  </>
                )}
                
                {/* Merge indicator */}
                {commit.isMerge && (
                  <text
                    x={pos.x}
                    y={pos.y + 55}
                    textAnchor="middle"
                    className="fill-amber-400 text-xs font-bold"
                  >
                    MERGE
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Branch labels */}
          {state.branches.map((branch, branchIndex) => {
            const isCurrentBranch = branch.name === state.currentBranch && !state.detachedHead;
            return (
              <g key={branch.name}>
                <rect
                  x={10}
                  y={70 + (branchIndex * 80)}
                  width={Math.max(60, branch.name.length * 8)}
                  height="20"
                  rx="10"
                  fill={isCurrentBranch ? branch.color : "#6B7280"}
                  stroke={isCurrentBranch ? branch.color : "none"}
                  strokeWidth="2"
                />
                <text
                  x={10 + Math.max(60, branch.name.length * 8) / 2}
                  y={85 + (branchIndex * 80)}
                  textAnchor="middle"
                  className="fill-white text-xs font-medium"
                >
                  {branch.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default CommitGraph;