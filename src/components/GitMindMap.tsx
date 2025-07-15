import React, { useState } from 'react';
import { Search, BookOpen, GitBranch, Settings } from 'lucide-react';
import MindMapNode from './MindMapNode';
import { gitTopics } from '../data/gitTopics';

const GitMindMap: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const categories = Array.from(new Set(gitTopics.map(topic => topic.category)));

  const filteredTopics = gitTopics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Basics': return <BookOpen className="h-4 w-4" />;
      case 'Branching': return <GitBranch className="h-4 w-4" />;
      case 'Advanced': return <Settings className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Basics': return 'bg-green-500';
      case 'Branching': return 'bg-blue-500';
      case 'Advanced': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
      <div className="lg:col-span-1">
        <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-6 h-full">
          <h2 className="text-xl font-semibold text-white mb-6">Git Mind Map</h2>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          
          {/* Categories */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Categories</h3>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !selectedCategory 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              All Topics
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2 ${
                  selectedCategory === category 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {getCategoryIcon(category)}
                <span>{category}</span>
              </button>
            ))}
          </div>
          
          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Legend</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}></div>
                  <span className="text-xs text-gray-400">{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-3">
        <div className="bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-6 h-full overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTopics.map(topic => (
              <MindMapNode
                key={topic.id}
                topic={topic}
                isExpanded={expandedNodes.has(topic.id)}
                onToggle={() => toggleNode(topic.id)}
                categoryColor={getCategoryColor(topic.category)}
              />
            ))}
          </div>
          
          {filteredTopics.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No topics found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitMindMap;