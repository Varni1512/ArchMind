import React, { useState } from 'react';
import { Code, Download, FileCode } from 'lucide-react';
import { CodeGenerationModal } from './CodeGenerationModal';
import { ExportDiagramModal } from '@/components/canvas/export/ExportDiagramModal';
import { useLLDWorkspace } from '../context/LLDWorkspaceContext';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  excalidrawAPI?: any;
}

export function BottomActionBar({ excalidrawAPI }: Props) {
  const [isCodeGenOpen, setIsCodeGenOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const { currentQuestion, activeDiagramType } = useLLDWorkspace();
  const diagramType = currentQuestion?.recommendedDiagramType || activeDiagramType || 'Class Diagram';
  const projectName = currentQuestion?.title || 'LLD_Architecture';

  return (
    <>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] px-3 py-1.5 flex items-center gap-2 z-20">
        <button 
          onClick={() => setIsCodeGenOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full hover:bg-[#f1f0ff] transition-colors group text-indigo-600 hover:text-indigo-700 cursor-pointer text-sm font-medium"
        >
          <Code size={17} />
          <span>Generate Code</span>
        </button>

        <div className="w-[1px] h-4 bg-gray-200" />

        <button 
          onClick={() => setIsExportOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 transition-colors text-purple-700 cursor-pointer text-sm font-semibold shadow-xs"
          title="Export as Mermaid (.mmd), GitHub Markdown (.md), PNG, or SVG"
        >
          <Download size={16} />
          <span>Export Diagram</span>
          <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.2 rounded font-mono font-bold">.mmd</span>
        </button>
      </div>

      {isCodeGenOpen && (
        <CodeGenerationModal 
          excalidrawAPI={excalidrawAPI}
          diagramType={diagramType}
          onClose={() => setIsCodeGenOpen(false)}
        />
      )}

      {isExportOpen && (
        <ExportDiagramModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          excalidrawAPI={excalidrawAPI}
          projectName={projectName}
          diagramType={diagramType}
          workspaceType="lld"
        />
      )}
    </>
  );
}
