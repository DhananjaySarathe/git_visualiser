import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface GitCommit {
  id: string;
  message: string;
  author: string;
  timestamp: number;
  parent?: string;
  parents?: string[]; // For merge commits
  branch: string;
  isMerge?: boolean;
}

export interface GitBranch {
  name: string;
  commit: string;
  color: string;
}

export interface GitFile {
  name: string;
  status: 'modified' | 'added' | 'deleted' | 'untracked';
}

export interface GitState {
  commits: GitCommit[];
  branches: GitBranch[];
  currentBranch: string;
  head: string;
  staged: GitFile[];
  workingDir: GitFile[];
  initialized: boolean;
  detachedHead: boolean;
  commandHistory: Array<{ command: string; output: string; error?: boolean; timestamp: number }>;
}

type GitAction = 
  | { type: 'INIT' }
  | { type: 'ADD'; files: string[] }
  | { type: 'COMMIT'; message: string }
  | { type: 'CHECKOUT'; branch: string }
  | { type: 'CHECKOUT_COMMIT'; commitId: string }
  | { type: 'CREATE_BRANCH'; name: string; fromCommit?: string }
  | { type: 'MERGE'; branch: string }
  | { type: 'RESET'; mode: 'soft' | 'mixed' | 'hard'; target: string }
  | { type: 'ADD_COMMAND_HISTORY'; command: string; output: string; error?: boolean }
  | { type: 'CREATE_FILE'; filename: string }
  | { type: 'MODIFY_FILE'; filename: string }
  | { type: 'RESET_ALL' };

const branchColors = [
  '#10B981', // green
  '#3B82F6', // blue
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#06B6D4', // cyan
  '#F97316', // orange
  '#EC4899', // pink
];

const initialState: GitState = {
  commits: [],
  branches: [],
  currentBranch: '',
  head: '',
  staged: [],
  workingDir: [],
  initialized: false,
  detachedHead: false,
  commandHistory: [],
};

function generateCommitId(): string {
  return Math.random().toString(36).substr(2, 7);
}

function getBranchColor(index: number): string {
  return branchColors[index % branchColors.length];
}

function gitReducer(state: GitState, action: GitAction): GitState {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        initialized: true,
        currentBranch: 'main',
        branches: [{ name: 'main', commit: '', color: getBranchColor(0) }],
        workingDir: [{ name: 'README.md', status: 'untracked' }],
        detachedHead: false,
      };
      
    case 'CREATE_FILE':
      if (state.workingDir.find(f => f.name === action.filename)) {
        return state;
      }
      return {
        ...state,
        workingDir: [...state.workingDir, { name: action.filename, status: 'untracked' }],
      };
      
    case 'MODIFY_FILE':
      return {
        ...state,
        workingDir: state.workingDir.map(file => 
          file.name === action.filename 
            ? { ...file, status: 'modified' as const }
            : file
        ),
      };
      
    case 'ADD':
      const filesToAdd = action.files.includes('.') 
        ? state.workingDir.map(f => f.name)
        : action.files;
        
      const newStaged = filesToAdd.map(filename => {
        const existingFile = state.workingDir.find(f => f.name === filename);
        return existingFile || { name: filename, status: 'added' as const };
      });
      
      return {
        ...state,
        staged: [...state.staged.filter(f => !filesToAdd.includes(f.name)), ...newStaged],
        workingDir: state.workingDir.filter(file => !filesToAdd.includes(file.name)),
      };
      
    case 'COMMIT':
      if (state.staged.length === 0) {
        return state;
      }
      
      const commitId = generateCommitId();
      const newCommit: GitCommit = {
        id: commitId,
        message: action.message,
        author: 'User',
        timestamp: Date.now(),
        parent: state.head || undefined,
        branch: state.currentBranch,
      };
      
      return {
        ...state,
        commits: [...state.commits, newCommit],
        head: commitId,
        staged: [],
        detachedHead: false,
        branches: state.branches.map(branch => 
          branch.name === state.currentBranch 
            ? { ...branch, commit: commitId }
            : branch
        ),
      };
      
    case 'CHECKOUT':
      const targetBranch = state.branches.find(b => b.name === action.branch);
      if (!targetBranch) return state;
      
      return {
        ...state,
        currentBranch: action.branch,
        head: targetBranch.commit,
        detachedHead: false,
      };
      
    case 'CHECKOUT_COMMIT':
      const commit = state.commits.find(c => c.id.startsWith(action.commitId));
      if (!commit) return state;
      
      return {
        ...state,
        head: commit.id,
        detachedHead: true,
        currentBranch: '',
      };
      
    case 'CREATE_BRANCH':
      if (state.branches.find(b => b.name === action.name)) return state;
      
      const fromCommit = action.fromCommit || state.head;
      const newBranchColor = getBranchColor(state.branches.length);
      
      return {
        ...state,
        branches: [...state.branches, { 
          name: action.name, 
          commit: fromCommit,
          color: newBranchColor 
        }],
      };
      
    case 'MERGE':
      const sourceBranch = state.branches.find(b => b.name === action.branch);
      if (!sourceBranch || sourceBranch.name === state.currentBranch) return state;
      
      const mergeCommitId = generateCommitId();
      const sourceCommit = state.commits.find(c => c.id === sourceBranch.commit);
      
      const mergeCommit: GitCommit = {
        id: mergeCommitId,
        message: `Merge branch '${action.branch}' into ${state.currentBranch}`,
        author: 'User',
        timestamp: Date.now(),
        parent: state.head,
        parents: [state.head, sourceBranch.commit],
        branch: state.currentBranch,
        isMerge: true,
      };
      
      return {
        ...state,
        commits: [...state.commits, mergeCommit],
        head: mergeCommitId,
        branches: state.branches.map(branch => 
          branch.name === state.currentBranch 
            ? { ...branch, commit: mergeCommitId }
            : branch
        ),
      };
      
    case 'RESET':
      if (action.target === 'HEAD~1' && state.commits.length > 0) {
        const currentCommit = state.commits.find(c => c.id === state.head);
        if (!currentCommit?.parent) return state;
        
        const targetCommit = currentCommit.parent;
        
        return {
          ...state,
          head: targetCommit,
          branches: state.branches.map(branch => 
            branch.name === state.currentBranch 
              ? { ...branch, commit: targetCommit }
              : branch
          ),
          staged: action.mode === 'hard' ? [] : state.staged,
          workingDir: action.mode === 'hard' ? [] : state.workingDir,
        };
      }
      return state;
      
    case 'ADD_COMMAND_HISTORY':
      return {
        ...state,
        commandHistory: [...state.commandHistory, {
          command: action.command,
          output: action.output,
          error: action.error,
          timestamp: Date.now(),
        }],
      };
      
    case 'RESET_ALL':
      return initialState;
      
    default:
      return state;
  }
}

const GitContext = createContext<{
  state: GitState;
  dispatch: React.Dispatch<GitAction>;
} | null>(null);

export const GitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gitReducer, initialState);
  
  return (
    <GitContext.Provider value={{ state, dispatch }}>
      {children}
    </GitContext.Provider>
  );
};

export const useGit = () => {
  const context = useContext(GitContext);
  if (!context) {
    throw new Error('useGit must be used within a GitProvider');
  }
  return context;
};