import { UMLAST, UMLNode, UMLEdge } from '../types';

/**
 * The ASTEngine is responsible for converting raw canvas visual elements
 * into the ArchMind UML AST, which is the structured data model consumed by
 * all AI features, Code Generators, and Interview modules.
 */
export class ASTEngine {
  
  /**
   * Parses raw Excalidraw elements and extracts the semantic UML AST.
   * It looks for `customData` embedded in grouped Excalidraw elements.
   * 
   * @param elements - The raw Excalidraw scene elements
   * @returns UMLAST - The structured UML representation
   */
  public static parseFromCanvas(elements: readonly any[]): UMLAST {
    const nodes: UMLNode[] = [];
    const edges: UMLEdge[] = [];

    // In Excalidraw, a semantic UML Class is represented as a group of shapes.
    // We expect the 'parent' container of a UML node to have customData.umlNode
    const processedGroups = new Set<string>();

    elements.forEach(el => {
      // 1. Check for Node
      if (el.groupIds && el.groupIds.length > 0) {
        const topLevelGroupId = el.groupIds[el.groupIds.length - 1];
        
        if (!processedGroups.has(topLevelGroupId)) {
          // If this element has our custom structured data, it's a UML Node
          if (el.customData && el.customData.umlNode) {
            nodes.push(el.customData.umlNode as UMLNode);
            processedGroups.add(topLevelGroupId);
          }
        }
      }

      // 2. Check for Edge (Lines/Arrows in Excalidraw)
      if (el.type === 'arrow' || el.type === 'line') {
        if (el.customData && el.customData.umlEdge) {
          edges.push(el.customData.umlEdge as UMLEdge);
        }
      }
    });

    return { nodes, edges };
  }

  /**
   * Helper function to inject structured data into a set of Excalidraw elements
   * that make up a UML node.
   */
  public static bindDataToElements(elements: any[], nodeData: UMLNode) {
    elements.forEach(el => {
      if (!el.customData) el.customData = {};
      el.customData.umlNode = nodeData;
    });
  }

  /**
   * Helper function to inject structured data into an Excalidraw edge element.
   */
  public static bindDataToEdge(element: any, edgeData: UMLEdge) {
    if (!element.customData) element.customData = {};
    element.customData.umlEdge = edgeData;
  }
}
