import React from 'react';
import { ChevronDown, ChevronRight, Copy, ExternalLink } from 'lucide-react';

interface GitTopic {
  id: string;
  name: string;
  category: string;
  description: string;
  examples: string[];
  useCases: string[];
  relatedCommands?: string[];
}

interface MindMapNodeProps {
  topic: GitTopic;
  isExpanded: boolean;
  onToggle: () => void;
  categoryColor: string;
}

const MindMapNode: React.FC<MindMapNodeProps> = ({ topic, isExpanded, onToggle, categoryColor }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="bg-slate-700 rounded-lg border border-slate-600 overflow-hidden transition-all duration-200 hover:border-slate-500">
      <div
        className="p-4 cursor-pointer hover:bg-slate-600 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${categoryColor}`}></div>
            <h3 className="font-medium text-white">{topic.name}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 bg-slate-600 px-2 py-1 rounded">
              {topic.category}
            </span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-600">
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Description</h4>
              <p className="text-sm text-gray-400">{topic.description}</p>
            </div>
            
            {topic.examples.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Examples</h4>
                <div className="space-y-2">
                  {topic.examples.map((example, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-800 rounded p-2">
                      <code className="text-sm text-green-400 font-mono">{example}</code>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(example);
                        }}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {topic.useCases.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Use Cases</h4>
                <ul className="space-y-1">
                  {topic.useCases.map((useCase, index) => (
                    <li key={index} className="text-sm text-gray-400 flex items-start space-x-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {topic.relatedCommands && topic.relatedCommands.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Related Commands</h4>
                <div className="flex flex-wrap gap-2">
                  {topic.relatedCommands.map((command, index) => (
                    <span key={index} className="text-xs bg-slate-600 text-gray-300 px-2 py-1 rounded">
                      {command}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MindMapNode;