'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import '@excalidraw/excalidraw/index.css';

const ArchMindCanvas = dynamic(
  () => import('./ArchMindCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full bg-[#faf9f6]">
        <div className="text-primary/50 text-sm font-medium animate-pulse">Loading Canvas Workspace...</div>
      </div>
    ),
  }
);

export default function ExcalidrawWrapper() {
  return (
    <div className="w-full h-full excalidraw-archmind-theme">
      <ArchMindCanvas />
      <style dangerouslySetInnerHTML={{__html: `
        .excalidraw-archmind-theme {
          --color-bg-canvas: #faf9f6 !important;
          --color-primary: #1e293b !important;
          --color-primary-darker: #0f172a !important;
          --color-primary-darkest: #020617 !important;
          
          /* Custom UI Styling */
          --border-radius: 12px !important;
          --font-family: var(--font-inter) !important;
        }

        /* Hide unused vendor UI elements */
        .excalidraw .layer-ui__wrapper .help-icon,
        .excalidraw .layer-ui__wrapper button[title*="Help"],
        .excalidraw .layer-ui__wrapper button[aria-label*="Help"],
        .excalidraw .layer-ui__wrapper [data-testid="help-menu"] {
          display: none !important;
        }

        .excalidraw .layer-ui__wrapper .sidebar-trigger,
        .excalidraw .layer-ui__wrapper button[title*="Library"],
        .excalidraw .layer-ui__wrapper button[aria-label*="Library"],
        .excalidraw .layer-ui__wrapper [data-testid="library-button"],
        .excalidraw .layer-ui__wrapper .library-menu-control {
          display: none !important;
        }

        /* Hide vendor shape flyout tools */
        .excalidraw .layer-ui__wrapper button[aria-label*="More"],
        .excalidraw .layer-ui__wrapper button[aria-label*="More tools"],
        .excalidraw .layer-ui__wrapper button[title*="More"],
        .excalidraw .layer-ui__wrapper [data-testid="toolbar-more-tools"],
        .excalidraw .layer-ui__wrapper button[aria-label*="Shapes"],
        .excalidraw .layer-ui__wrapper button[title*="Shapes"] {
          display: none !important;
        }
      `}} />
    </div>
  );
}
