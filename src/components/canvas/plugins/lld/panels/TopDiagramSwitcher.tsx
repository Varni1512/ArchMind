import React, { useState } from 'react';
import { useLLDWorkspace } from '../context/LLDWorkspaceContext';
import { DiagramType } from '../types';
import { ChevronDown, Network } from 'lucide-react';

const DIAGRAM_TYPES: DiagramType[] = [
  'Class Diagram',
  'Object Diagram',
  'Package Diagram',
  'Sequence Diagram',
  'Activity Diagram',
  'State Diagram',
  'Use Case Diagram',
  'Component Diagram',
  'Deployment Diagram'
];

export function TopDiagramSwitcher() {
  const { activeDiagramType, setActiveDiagramType } = useLLDWorkspace();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-20">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-white border border-primary/20 px-4 py-2 rounded-xl shadow-md hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Network size={16} className="text-primary" />
          <span className="font-semibold text-gray-800 text-sm tracking-wide">
            {activeDiagramType}
          </span>
          <ChevronDown size={14} className="text-gray-500" />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-2 w-48 bg-white border border-primary/10 rounded-xl shadow-xl overflow-hidden py-1">
            {DIAGRAM_TYPES.map(type => (
              <button
                key={type}
                onClick={() => {
                  setActiveDiagramType(type);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                  activeDiagramType === type 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
