import { SavedDiagram, DiagramMetadata } from '../types';

export class HLDStorageManager {
  private static DIAGRAMS_KEY = 'archmind_hld_diagrams';
  private static AUTOSAVE_KEY = 'archmind_hld_autosave';

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

    const saved: SavedDiagram = { id, metadata, elements, appState };
    diagrams[id] = saved;
    
    localStorage.setItem(this.DIAGRAMS_KEY, JSON.stringify(diagrams));
    return saved;
  }

  static getAllDiagrams(): Record<string, SavedDiagram> {
    try {
      const data = localStorage.getItem(this.DIAGRAMS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  static deleteDiagram(id: string) {
    const diagrams = this.getAllDiagrams();
    delete diagrams[id];
    localStorage.setItem(this.DIAGRAMS_KEY, JSON.stringify(diagrams));
  }

  static autoSave(elements: any[], appState: any, metadata: Partial<DiagramMetadata> = {}) {
    localStorage.setItem(this.AUTOSAVE_KEY, JSON.stringify({ elements, appState, metadata, timestamp: Date.now() }));
  }

  static loadAutoSave() {
    try {
      const data = localStorage.getItem(this.AUTOSAVE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}
