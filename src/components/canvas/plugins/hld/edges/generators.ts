import { createArrow } from '../utils/elementGenerator';
import { ToolDefinition } from '../toolbar/DiagramTools';

export function generateHLDEdge(x: number, y: number, tool: ToolDefinition) {
  const edge = createArrow(x, y, [[0, 0], [150, 0]]);
  
  if (tool.id === 'AsyncConnection') {
    edge.strokeStyle = 'dashed';
    edge.endArrowhead = 'triangle';
  } else {
    edge.strokeStyle = 'solid';
    edge.endArrowhead = 'arrow';
  }
  
  return [edge];
}
