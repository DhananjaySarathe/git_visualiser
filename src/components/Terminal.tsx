import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Send, RotateCcw } from 'lucide-react';
import { useGit } from '../context/GitContext';

const Terminal: React.FC = () => {
  const [command, setCommand] = useState('');
  const { state, dispatch } = useGit();
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [state.commandHistory]);

  const addToHistory = (command: string, output: string, error = false) => {
    dispatch({ type: 'ADD_COMMAND_HISTORY', command, output, error });
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    let output = '';
    let error = false;

    if (!trimmedCmd) return;

    try {
      const parts = trimmedCmd.split(' ').filter(p => p.length > 0);
      const mainCommand = parts[0];
      const subCommand = parts[1];

      if (mainCommand === 'git') {
        if (!state.initialized && subCommand !== 'init') {
          output = 'fatal: not a git repository (or any of the parent directories): .git';
          error = true;
        } else {
          switch (subCommand) {
            case 'init':
              dispatch({ type: 'INIT' });
              output = 'Initialized empty Git repository in .git/';
              break;
              
            case 'add':
              if (parts.length < 3) {
                output = 'Nothing specified, nothing added.\nMaybe you wanted to say \'git add .\'?';
                error = true;
              } else if (parts[2] === '.') {
                if (state.workingDir.length === 0) {
                  output = 'No files to add.';
                } else {
                  dispatch({ type: 'ADD', files: ['.'] });
                  output = `Added ${state.workingDir.length} file(s) to staging area`;
                }
              } else {
                const filename = parts[2];
                if (state.workingDir.find(f => f.name === filename)) {
                  dispatch({ type: 'ADD', files: [filename] });
                  output = `Added '${filename}' to staging area`;
                } else {
                  output = `pathspec '${filename}' did not match any files`;
                  error = true;
                }
              }
              break;
              
            case 'commit':
              if (state.staged.length === 0) {
                output = 'nothing to commit, working tree clean';
                error = true;
              } else if (parts[2] === '-m' && parts[3]) {
                const message = parts.slice(3).join(' ').replace(/['"]/g, '');
                dispatch({ type: 'COMMIT', message });
                output = `[${state.currentBranch} ${state.head?.slice(0, 7)}] ${message}\n ${state.staged.length} file(s) changed`;
              } else {
                output = 'usage: git commit -m "commit message"';
                error = true;
              }
              break;
              
            case 'checkout':
              if (parts[2] === '-b' && parts[3]) {
                const branchName = parts[3];
                if (state.branches.find(b => b.name === branchName)) {
                  output = `fatal: A branch named '${branchName}' already exists.`;
                  error = true;
                } else {
                  dispatch({ type: 'CREATE_BRANCH', name: branchName });
                  dispatch({ type: 'CHECKOUT', branch: branchName });
                  output = `Switched to a new branch '${branchName}'`;
                }
              } else if (parts[2]) {
                const target = parts[2];
                const branch = state.branches.find(b => b.name === target);
                const commit = state.commits.find(c => c.id.startsWith(target));
                
                if (branch) {
                  dispatch({ type: 'CHECKOUT', branch: target });
                  output = `Switched to branch '${target}'`;
                } else if (commit) {
                  dispatch({ type: 'CHECKOUT_COMMIT', commitId: target });
                  output = `Note: switching to '${target}'.\n\nYou are in 'detached HEAD' state.`;
                } else {
                  output = `error: pathspec '${target}' did not match any file(s) known to git`;
                  error = true;
                }
              } else {
                output = 'usage: git checkout <branch> or git checkout -b <branch>';
                error = true;
              }
              break;
              
            case 'branch':
              if (parts[2]) {
                const branchName = parts[2];
                if (state.branches.find(b => b.name === branchName)) {
                  output = `fatal: A branch named '${branchName}' already exists.`;
                  error = true;
                } else {
                  dispatch({ type: 'CREATE_BRANCH', name: branchName });
                  output = `Created branch '${branchName}'`;
                }
              } else {
                output = state.branches.map(b => {
                  const prefix = b.name === state.currentBranch && !state.detachedHead ? '* ' : '  ';
                  return `${prefix}${b.name}`;
                }).join('\n');
                if (state.detachedHead) {
                  output = `* (HEAD detached at ${state.head.slice(0, 7)})\n${output}`;
                }
              }
              break;
              
            case 'merge':
              if (!parts[2]) {
                output = 'usage: git merge <branch>';
                error = true;
              } else {
                const branchToMerge = parts[2];
                const sourceBranch = state.branches.find(b => b.name === branchToMerge);
                
                if (!sourceBranch) {
                  output = `merge: ${branchToMerge} - not something we can merge`;
                  error = true;
                } else if (branchToMerge === state.currentBranch) {
                  output = `Already on '${branchToMerge}'`;
                } else {
                  dispatch({ type: 'MERGE', branch: branchToMerge });
                  output = `Merge made by the 'recursive' strategy.`;
                }
              }
              break;
              
            case 'status':
              let statusOutput = '';
              if (state.detachedHead) {
                statusOutput += `HEAD detached at ${state.head.slice(0, 7)}\n`;
              } else {
                statusOutput += `On branch ${state.currentBranch}\n`;
              }
              
              if (state.staged.length > 0) {
                statusOutput += `\nChanges to be committed:\n`;
                statusOutput += state.staged.map(f => `  ${f.status}: ${f.name}`).join('\n');
              }
              
              if (state.workingDir.length > 0) {
                statusOutput += `\nUntracked files:\n`;
                statusOutput += state.workingDir.map(f => `  ${f.name}`).join('\n');
              }
              
              if (state.staged.length === 0 && state.workingDir.length === 0) {
                statusOutput += '\nnothing to commit, working tree clean';
              }
              
              output = statusOutput;
              break;
              
            case 'log':
              if (state.commits.length === 0) {
                output = 'fatal: your current branch does not have any commits yet';
                error = true;
              } else {
                const relevantCommits = state.commits.filter(commit => {
                  if (state.detachedHead) {
                    // Show commits reachable from current HEAD
                    let current = state.head;
                    const reachable = new Set([current]);
                    
                    while (current) {
                      const commit = state.commits.find(c => c.id === current);
                      if (commit?.parent) {
                        reachable.add(commit.parent);
                        current = commit.parent;
                      } else {
                        break;
                      }
                    }
                    
                    return reachable.has(commit.id);
                  }
                  return true;
                });
                
                output = relevantCommits.slice().reverse().map(commit => 
                  `commit ${commit.id}\nAuthor: ${commit.author}\nDate: ${new Date(commit.timestamp).toLocaleString()}\n\n    ${commit.message}\n`
                ).join('\n');
              }
              break;
              
            case 'reset':
              if (parts[2] === '--hard' && parts[3] === 'HEAD~1') {
                if (state.commits.length === 0) {
                  output = 'fatal: ambiguous argument \'HEAD~1\': unknown revision';
                  error = true;
                } else {
                  dispatch({ type: 'RESET', mode: 'hard', target: 'HEAD~1' });
                  output = `HEAD is now at ${state.head?.slice(0, 7)}`;
                }
              } else {
                output = 'usage: git reset --hard HEAD~1';
                error = true;
              }
              break;
              
            default:
              output = `git: '${subCommand}' is not a git command. See 'git --help'.`;
              error = true;
          }
        }
      } else if (mainCommand === 'touch') {
        if (parts[1]) {
          dispatch({ type: 'CREATE_FILE', filename: parts[1] });
          output = `Created file: ${parts[1]}`;
        } else {
          output = 'usage: touch <filename>';
          error = true;
        }
      } else if (mainCommand === 'echo') {
        if (parts.length >= 4 && parts[parts.length - 2] === '>') {
          const filename = parts[parts.length - 1];
          dispatch({ type: 'MODIFY_FILE', filename });
          output = `Modified file: ${filename}`;
        } else {
          output = parts.slice(1).join(' ');
        }
      } else if (mainCommand === 'clear') {
        dispatch({ type: 'RESET_ALL' });
        setCommand('');
        return;
      } else if (mainCommand === 'help') {
        output = `Available commands:
git init              - Initialize a new Git repository
git add <file>        - Add file to staging area
git add .             - Add all files to staging area
git commit -m "msg"   - Commit staged changes
git checkout <branch> - Switch branches
git checkout -b <br>  - Create and switch to new branch
git branch [name]     - List branches or create new branch
git merge <branch>    - Merge a branch
git status            - Show repository status
git log               - Show commit history
git reset --hard HEAD~1 - Reset to previous commit
touch <file>          - Create a new file
echo "text" > <file>  - Modify a file
clear                 - Clear terminal and reset
help                  - Show this help message`;
      } else {
        output = `Command not found: ${mainCommand}. Type 'help' for available commands.`;
        error = true;
      }
    } catch (err) {
      output = 'An error occurred while executing the command.';
      error = true;
    }

    addToHistory(trimmedCmd, output, error);
    setCommand('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(command);
    }
  };

  const resetRepository = () => {
    dispatch({ type: 'RESET_ALL' });
  };

  const getPrompt = () => {
    if (!state.initialized) return 'user@computer:~$ ';
    if (state.detachedHead) return `user@repo:((${state.head.slice(0, 7)}))$ `;
    return `user@repo:(${state.currentBranch})$ `;
  };

  return (
    <div className="bg-slate-900 rounded-lg shadow-xl border border-slate-700 overflow-hidden h-full flex flex-col">
      <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="h-5 w-5 text-green-400" />
          <span className="text-white font-medium">Git Terminal</span>
        </div>
        <button
          onClick={resetRepository}
          className="flex items-center space-x-1 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm text-gray-300 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>
      
      <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto font-mono text-sm">
        {state.commandHistory.slice(-10).map((item, index) => (
          <div key={index} className="mb-3">
            <div className="flex items-start space-x-2">
              <span className="text-green-400 whitespace-nowrap">{getPrompt()}</span>
              <span className="text-white break-all">{item.command}</span>
            </div>
            {item.output && (
              <div className={`mt-1 whitespace-pre-wrap ml-6 ${item.error ? 'text-red-400' : 'text-gray-300'}`}>
                {item.output}
              </div>
            )}
          </div>
        ))}
        
        <div className="flex items-center space-x-2">
          <span className="text-green-400 whitespace-nowrap">{getPrompt()}</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent text-white outline-none"
            placeholder="Type a git command..."
          />
          <button
            onClick={() => executeCommand(command)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Terminal;