import React, { useState } from 'react';
import { Code } from 'lucide-react';
import { CodeGenerationModal } from './CodeGenerationModal';
import { useLLDWorkspace } from '../context/LLDWorkspaceContext';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  excalidrawAPI?: any;
}

export function BottomActionBar({ excalidrawAPI }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentQuestion } = useLLDWorkspace();
  const diagramType = currentQuestion?.recommendedDiagramType || 'Unknown Diagram';

  return (
    <>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 flex items-center gap-2 z-20">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full hover:bg-[#f1f0ff] transition-colors group text-indigo-600 hover:text-indigo-700 cursor-pointer text-sm font-medium"
        >
          <Code size={18} />
          <span>Generate Code</span>
        </button>
      </div>

      {isModalOpen && (
        <CodeGenerationModal 
          excalidrawAPI={excalidrawAPI}
          diagramType={diagramType}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
