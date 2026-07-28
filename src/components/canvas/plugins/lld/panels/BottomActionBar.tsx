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
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface border border-primary/10 rounded-full shadow-lg px-2 py-2 flex items-center gap-2 z-20">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-primary/5 transition-colors group text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          <Code size={18} />
          <span className="text-sm font-medium">Generate Code</span>
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
