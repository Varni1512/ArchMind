import { SavedDiagram, DiagramMetadata } from '../types';
import { 
  STORAGE_KEYS, 
  saveCanvasData, 
  loadCanvasData, 
  clearCanvasData, 
  sanitizeAppState 
} from '@/lib/storage/canvasPersistence';

export class HLDStorageManager {
  private static DIAGRAMS_KEY = STORAGE_KEYS.HLD_DIAGRAMS;
  private static AUTOSAVE_KEY = STORAGE_KEYS.HLD_AUTOSAVE;

  static saveDiagram(
    id: string,
    projectName: string,
    diagramType: any,
    linkedQuestionId: string | null,
    elements: any[],
    appState: any
  ): SavedDiagram {
    const diagrams = this.getAllDiagrams();
    
    const existing = diagrams[id];
    const version = existing ? existing.metadata.version + 1 : 1;
    const createdAt = existing ? existing.metadata.createdAt : Date.now();

    const metadata: DiagramMetadata = {
      projectName,
      diagramType,
      linkedQuestionId,
      version,
      createdAt,
      updatedAt: Date.now()
    };

    const saved: SavedDiagram = { 
      id, 
      metadata, 
      elements, 
      appState: sanitizeAppState(appState) 
    };
    diagrams[id] = saved;
    
    saveCanvasData(this.DIAGRAMS_KEY, diagrams);
    return saved;
  }

  static getAllDiagrams(): Record<string, SavedDiagram> {
    const data = loadCanvasData<Record<string, SavedDiagram>>(this.DIAGRAMS_KEY);
    return data || {};
  }

  static deleteDiagram(id: string) {
    const diagrams = this.getAllDiagrams();
    delete diagrams[id];
    saveCanvasData(this.DIAGRAMS_KEY, diagrams);
  }

  static autoSave(elements: any[], appState: any, metadata: Partial<DiagramMetadata> = {}) {
    saveCanvasData(this.AUTOSAVE_KEY, { 
      elements, 
      appState: sanitizeAppState(appState), 
      metadata, 
      timestamp: Date.now() 
    });
  }

  static loadAutoSave() {
    return loadCanvasData<{
      elements: any[];
      appState: any;
      metadata: Partial<DiagramMetadata>;
      timestamp: number;
    }>(this.AUTOSAVE_KEY);
  }

  static clearAutoSave() {
    clearCanvasData(this.AUTOSAVE_KEY);
  }
}
