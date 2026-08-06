'use client';

import React, { useState } from 'react';
import ExcalidrawWrapper from '@/components/canvas/ExcalidrawWrapper';
import { STORAGE_KEYS } from '@/lib/storage/canvasPersistence';
import { ExportDiagramModal } from '@/components/canvas/export/ExportDiagramModal';
import { Download } from 'lucide-react';

export function CanvasPageClient() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="absolute inset-0 bg-[#faf9f6] overflow-hidden">
      <ExcalidrawWrapper 
        storageKey={STORAGE_KEYS.BLANK_CANVAS} 
        autoSave={true} 
        showSaveIndicator={true}
        onAPI={setExcalidrawAPI}
      />

      {/* Floating Bottom Action Bar for Export */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] px-3 py-1.5 flex items-center gap-2 z-20">
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

      {isExportOpen && (
        <ExportDiagramModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          excalidrawAPI={excalidrawAPI}
          projectName="Blank_Canvas_Diagram"
          diagramType="Freeform Architecture"
          workspaceType="canvas"
        />
      )}
    </div>
  );
}
