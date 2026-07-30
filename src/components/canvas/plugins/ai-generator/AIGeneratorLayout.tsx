'use client';

import React, { useState, useCallback, useEffect } from 'react';
import ExcalidrawWrapper from '../../ExcalidrawWrapper';
import { AIControlPanel } from './panels/AIControlPanel';
import { ArchitectureExplanationPanel } from './panels/ArchitectureExplanationPanel';
import { AIGeneratorProvider, useAIGenerator } from './context/AIGeneratorContext';
import { Sparkles, Info } from 'lucide-react';

function WorkspaceContent() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { explanationData } = useAIGenerator();
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

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

  // Auto-open explanation when data arrives
  useEffect(() => {
    if (explanationData) {
      setIsExplanationOpen(true);
    }
  }, [explanationData]);

  return (
    <div className="absolute inset-0 bg-[#faf9f6] overflow-hidden flex w-full">
      
      {/* Left Panel - Control Panel */}
      {isSidebarOpen && (
        <AIControlPanel 
          excalidrawAPI={excalidrawAPI} 
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Center Canvas Workspace */}
      <div className="flex-1 relative h-full">
        
        <ExcalidrawWrapper onAPI={handleAPI} />

        {/* Sidebar Toggle Button */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 bg-surface border border-primary/10 rounded-xl shadow-lg p-2 flex items-center justify-center text-purple-600 hover:bg-primary/5 transition-colors z-10 cursor-pointer"
            title="Open AI Architect Panel"
          >
            <Sparkles size={20} />
          </button>
        )}

        {/* Explanation Toggle Button */}
        {!isExplanationOpen && explanationData && (
          <button 
            onClick={() => setIsExplanationOpen(true)}
            className="absolute top-20 right-4 bg-surface border border-primary/10 rounded-xl shadow-lg p-2 flex items-center justify-center text-blue-600 hover:bg-primary/5 transition-colors z-10 cursor-pointer"
            title="View Architecture Details"
          >
            <Info size={20} />
          </button>
        )}
      </div>

      {/* Right Panel */}
      {isExplanationOpen && (
        <ArchitectureExplanationPanel onClose={() => setIsExplanationOpen(false)} />
      )}
      
    </div>
  );
}

export function AIGeneratorLayout() {
  return (
    <AIGeneratorProvider>
      <WorkspaceContent />
    </AIGeneratorProvider>
  );
}
