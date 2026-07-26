import React, { useEffect } from 'react';
import { Excalidraw, MainMenu, WelcomeScreen } from '@excalidraw/excalidraw';
import { LogoIcon } from '@/components/icons/LogoIcon';

export default function ArchMindCanvas() {
  /**
   * Registers a global listener to ensure that active radix-ui popovers 
   * are properly dismissed when interacting with the canvas element.
   */
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (e.target instanceof HTMLCanvasElement) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
      }
    };
    
    // Use capture phase to ensure it runs before Excalidraw's internal handlers might stop propagation
    document.addEventListener('pointerdown', handlePointerDown, { capture: true });
    return () => document.removeEventListener('pointerdown', handlePointerDown, { capture: true });
  }, []);

  return (
    <Excalidraw 
      theme="light"
      name="ArchMind Canvas"
      // UIOptions allows us to aggressively hide their default floating panels
      UIOptions={{
        canvasActions: {
          loadScene: false, // Hides the folder icon
          export: { saveFileToDisk: true },
          toggleTheme: true, // We can keep their dark mode toggle or remove it
        }
      }}
    >
      {/* Custom Main Menu Configuration */}
      <MainMenu>
        <MainMenu.DefaultItems.Export />
        <MainMenu.DefaultItems.SaveAsImage />
        <MainMenu.DefaultItems.ClearCanvas />
        <MainMenu.Separator />
        <MainMenu.DefaultItems.ChangeCanvasBackground />
      </MainMenu>

      {/* Custom Welcome Screen Configuration */}
      <WelcomeScreen>
        <WelcomeScreen.Hints.MenuHint />
        <WelcomeScreen.Hints.ToolbarHint />
        
        <WelcomeScreen.Center>
          <WelcomeScreen.Center.Logo>
            <div className="flex items-center gap-3 select-none mb-4">
              <LogoIcon className="w-10 h-10" />
              <span className="text-3xl font-extrabold text-[#354259] tracking-tight" style={{ fontFamily: 'var(--font-inter)' }}>ArchMind</span>
            </div>
          </WelcomeScreen.Center.Logo>
          <WelcomeScreen.Center.Heading>
            Blank Canvas Workspace
          </WelcomeScreen.Center.Heading>
        </WelcomeScreen.Center>
      </WelcomeScreen>
    </Excalidraw>
  );
}
