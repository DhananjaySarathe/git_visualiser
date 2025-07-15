export interface GitTopic {
  id: string;
  name: string;
  category: string;
  description: string;
  examples: string[];
  useCases: string[];
  relatedCommands?: string[];
}

export const gitTopics: GitTopic[] = [
  {
    id: 'init',
    name: 'git init',
    category: 'Basics',
    description: 'Initialize a new Git repository in the current directory.',
    examples: ['git init', 'git init my-project'],
    useCases: [
      'Starting a new project',
      'Converting an existing project to use Git',
      'Creating a new repository from scratch'
    ],
    relatedCommands: ['git clone', 'git status']
  },
  {
    id: 'clone',
    name: 'git clone',
    category: 'Basics',
    description: 'Create a local copy of a remote repository.',
    examples: [
      'git clone https://github.com/user/repo.git',
      'git clone git@github.com:user/repo.git',
      'git clone https://github.com/user/repo.git my-folder'
    ],
    useCases: [
      'Getting a copy of an existing project',
      'Contributing to open source projects',
      'Backing up remote repositories locally'
    ],
    relatedCommands: ['git init', 'git remote', 'git pull']
  },
  {
    id: 'add',
    name: 'git add',
    category: 'Basics',
    description: 'Stage changes for the next commit.',
    examples: [
      'git add file.txt',
      'git add .',
      'git add -A',
      'git add *.js'
    ],
    useCases: [
      'Preparing changes for commit',
      'Staging specific files',
      'Adding all changes at once'
    ],
    relatedCommands: ['git commit', 'git status', 'git reset']
  },
  {
    id: 'commit',
    name: 'git commit',
    category: 'Basics',
    description: 'Save staged changes to the repository with a message.',
    examples: [
      'git commit -m "Add new feature"',
      'git commit -am "Fix bug and update docs"',
      'git commit --amend'
    ],
    useCases: [
      'Saving changes with a descriptive message',
      'Creating checkpoints in development',
      'Modifying the last commit'
    ],
    relatedCommands: ['git add', 'git push', 'git log']
  },
  {
    id: 'status',
    name: 'git status',
    category: 'Basics',
    description: 'Show the current state of the working directory and staging area.',
    examples: [
      'git status',
      'git status -s',
      'git status --porcelain'
    ],
    useCases: [
      'Checking what files have changed',
      'Seeing what\'s staged for commit',
      'Understanding the current repository state'
    ],
    relatedCommands: ['git add', 'git commit', 'git diff']
  },
  {
    id: 'log',
    name: 'git log',
    category: 'Basics',
    description: 'View commit history of the repository.',
    examples: [
      'git log',
      'git log --oneline',
      'git log --graph --all',
      'git log -p'
    ],
    useCases: [
      'Reviewing project history',
      'Finding specific commits',
      'Understanding code changes over time'
    ],
    relatedCommands: ['git show', 'git diff', 'git blame']
  },
  {
    id: 'branch',
    name: 'git branch',
    category: 'Branching',
    description: 'List, create, or delete branches.',
    examples: [
      'git branch',
      'git branch feature-branch',
      'git branch -d feature-branch',
      'git branch -r'
    ],
    useCases: [
      'Creating new feature branches',
      'Listing all branches',
      'Deleting merged branches'
    ],
    relatedCommands: ['git checkout', 'git merge', 'git switch']
  },
  {
    id: 'checkout',
    name: 'git checkout',
    category: 'Branching',
    description: 'Switch branches or restore working tree files.',
    examples: [
      'git checkout main',
      'git checkout -b new-feature',
      'git checkout -- file.txt',
      'git checkout HEAD~1'
    ],
    useCases: [
      'Switching between branches',
      'Creating and switching to new branches',
      'Restoring files to previous versions'
    ],
    relatedCommands: ['git branch', 'git switch', 'git restore']
  },
  {
    id: 'merge',
    name: 'git merge',
    category: 'Branching',
    description: 'Join two or more development histories together.',
    examples: [
      'git merge feature-branch',
      'git merge --no-ff feature-branch',
      'git merge --squash feature-branch'
    ],
    useCases: [
      'Integrating feature branches',
      'Combining parallel development work',
      'Bringing changes from one branch to another'
    ],
    relatedCommands: ['git branch', 'git checkout', 'git rebase']
  },
  {
    id: 'pull',
    name: 'git pull',
    category: 'Branching',
    description: 'Fetch and merge changes from a remote repository.',
    examples: [
      'git pull',
      'git pull origin main',
      'git pull --rebase'
    ],
    useCases: [
      'Getting latest changes from remote',
      'Synchronizing with team members',
      'Updating local branch with remote changes'
    ],
    relatedCommands: ['git fetch', 'git merge', 'git push']
  },
  {
    id: 'push',
    name: 'git push',
    category: 'Branching',
    description: 'Upload local commits to a remote repository.',
    examples: [
      'git push',
      'git push origin main',
      'git push -u origin feature-branch',
      'git push --force'
    ],
    useCases: [
      'Sharing changes with team members',
      'Backing up work to remote repository',
      'Publishing new features'
    ],
    relatedCommands: ['git pull', 'git fetch', 'git remote']
  },
  {
    id: 'rebase',
    name: 'git rebase',
    category: 'Advanced',
    description: 'Reapply commits on top of another base tip.',
    examples: [
      'git rebase main',
      'git rebase -i HEAD~3',
      'git rebase --onto main feature~5 feature'
    ],
    useCases: [
      'Creating a cleaner project history',
      'Squashing commits',
      'Moving branches to new base commits'
    ],
    relatedCommands: ['git merge', 'git cherry-pick', 'git reset']
  },
  {
    id: 'stash',
    name: 'git stash',
    category: 'Advanced',
    description: 'Temporarily store changes in a dirty working directory.',
    examples: [
      'git stash',
      'git stash pop',
      'git stash list',
      'git stash apply stash@{0}'
    ],
    useCases: [
      'Switching branches with uncommitted changes',
      'Temporarily saving work in progress',
      'Cleaning working directory quickly'
    ],
    relatedCommands: ['git checkout', 'git commit', 'git reset']
  },
  {
    id: 'reset',
    name: 'git reset',
    category: 'Advanced',
    description: 'Reset current HEAD to the specified state.',
    examples: [
      'git reset HEAD~1',
      'git reset --hard HEAD~1',
      'git reset --soft HEAD~1',
      'git reset file.txt'
    ],
    useCases: [
      'Undoing commits',
      'Unstaging files',
      'Moving branch pointer to different commit'
    ],
    relatedCommands: ['git revert', 'git checkout', 'git stash']
  },
  {
    id: 'cherry-pick',
    name: 'git cherry-pick',
    category: 'Advanced',
    description: 'Apply the changes introduced by specific commits.',
    examples: [
      'git cherry-pick abc123',
      'git cherry-pick abc123..def456',
      'git cherry-pick -n abc123'
    ],
    useCases: [
      'Applying specific fixes from other branches',
      'Selectively bringing changes',
      'Hotfix deployment'
    ],
    relatedCommands: ['git rebase', 'git merge', 'git revert']
  },
  {
    id: 'tag',
    name: 'git tag',
    category: 'Advanced',
    description: 'Create, list, delete or verify tags.',
    examples: [
      'git tag v1.0.0',
      'git tag -a v1.0.0 -m "Version 1.0.0"',
      'git tag -d v1.0.0',
      'git push origin v1.0.0'
    ],
    useCases: [
      'Marking release points',
      'Creating version milestones',
      'Referencing specific commits'
    ],
    relatedCommands: ['git commit', 'git push', 'git checkout']
  }
];