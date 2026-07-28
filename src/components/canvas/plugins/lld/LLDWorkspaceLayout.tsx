'use client';

import React, { useState, useCallback, useEffect } from 'react';
import ExcalidrawWrapper from '../../ExcalidrawWrapper';
import { QuestionExplorerPanel } from './panels/QuestionExplorerPanel';
import { LLDAssistantPanel } from './panels/LLDAssistantPanel';
import { BottomActionBar } from './panels/BottomActionBar';
import { UMLToolbarPlugin } from './toolbar/UMLToolbarPlugin';
import { TopDiagramSwitcher } from './panels/TopDiagramSwitcher';
import { QuestionStartModal } from './panels/QuestionStartModal';
import { LLDWorkspaceProvider, useLLDWorkspace } from './context/LLDWorkspaceContext';
import { Sparkles, X, BookOpen } from 'lucide-react';

function WorkspaceContent() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

  const { loadedHistory, setLoadedHistory } = useLLDWorkspace();

  const handleAPI = useCallback((api: any) => {
    setExcalidrawAPI(api);
  }, []);

  // Suppress Excalidraw's internal controlled input warning
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('A component is changing a controlled input')) return;
      if (typeof args[0] === 'string' && args[0].includes('Linear element is not normalized')) return;
      originalError(...args);
    };
    return () => { console.error = originalError; };
  }, []);

  // Restore history to canvas when loadedHistory changes
  useEffect(() => {
    if (loadedHistory && excalidrawAPI) {
      if (loadedHistory.elements && Array.isArray(loadedHistory.elements)) {
        excalidrawAPI.updateScene({ elements: loadedHistory.elements });
      }
      setIsAssistantOpen(true); // Open assistant to view restored evaluation/chat
    }
  }, [loadedHistory, excalidrawAPI]);

  return (
    <div className="absolute inset-0 bg-[#faf9f6] overflow-hidden flex w-full">
      
      {/* Left Panel - Question Explorer */}
      {isExplorerOpen && (
        <div className="relative">
          <button 
            onClick={() => setIsExplorerOpen(false)}
            className="absolute top-4 right-4 p-1.5 text-primary/60 hover:text-primary-ink hover:bg-primary/10 rounded-lg transition-colors z-20"
            title="Close Explorer"
          >
            <X size={18} />
          </button>
          <QuestionExplorerPanel />
        </div>
      )}

      {/* Center Canvas Workspace */}
      <div className="flex-1 relative h-full">
        <TopDiagramSwitcher />
        <QuestionStartModal excalidrawAPI={excalidrawAPI} />
        
        <ExcalidrawWrapper onAPI={handleAPI} />
        
        {/* UML Toolbar Overlay */}
        <UMLToolbarPlugin excalidrawAPI={excalidrawAPI} />

        {/* Bottom Action Bar Overlay */}
        <BottomActionBar excalidrawAPI={excalidrawAPI} />

        {/* Explorer Toggle Button (Visible when closed) */}
        {!isExplorerOpen && (
          <button 
            onClick={() => setIsExplorerOpen(true)}
            className="absolute top-4 left-4 bg-surface border border-primary/10 rounded-xl shadow-lg p-2 flex items-center justify-center text-blue-600 hover:bg-primary/5 transition-colors z-10"
            title="Open Question Explorer"
          >
            <BookOpen size={20} />
          </button>
        )}

        {/* Assistant Toggle Button (Visible when closed) */}
        {!isAssistantOpen && (
          <button 
            onClick={() => setIsAssistantOpen(true)}
            className="absolute top-20 right-4 bg-surface border border-primary/10 rounded-xl shadow-lg p-2 flex items-center justify-center text-purple-600 hover:bg-primary/5 transition-colors z-10"
            title="Open LLD Assistant"
          >
            <Sparkles size={20} />
          </button>
        )}
      </div>

      {/* Right Panel (Slide in/out) */}
      {isAssistantOpen && (
        <div className="relative">
          <LLDAssistantPanel 
            excalidrawAPI={excalidrawAPI} 
            onClose={() => setIsAssistantOpen(false)} 
          />
        </div>
      )}
      
    </div>
  );
}

export function LLDWorkspaceLayout() {
  return (
    <LLDWorkspaceProvider>
      <WorkspaceContent />
    </LLDWorkspaceProvider>
  );
}

