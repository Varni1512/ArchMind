import React, { useState, useEffect } from 'react';
import { useLLDWorkspace } from '../context/LLDWorkspaceContext';
import { DIAGRAM_TOOLS_MAP } from './DiagramTools';
import { 
  Square, Box, Type, List, Layout, FileText, ArrowRight, CornerDownRight, 
  Focus, Link, GitMerge, MoveRight, User, Play, StopCircle, 
  Circle, HelpCircle, ArrowLeftRight, Navigation
} from 'lucide-react';
import { 
  generateClassNode, generateInterfaceNode, generateAbstractClassNode, 
  generateEnumNode, generatePackageNode, generateNoteNode,
  generateObjectNode, generateActorNode, generateLifelineNode,
  generateActivationNode, generateInitialNode, generateFinalNode,
  generateActionNode, generateDecisionNode, generateMergeNode,
  generateForkNode, generateJoinNode, generateUseCaseNode,
  generateComponentNode, generateDeviceNode, generateArtifactNode
} from '../nodes/generators';

// Dummy generator for unknown diagrams
const generateGenericNode = (x: number, y: number, name: string) => generateClassNode(x, y, name);

interface Props {
  excalidrawAPI?: any;
}

export function UMLToolbarPlugin({ excalidrawAPI }: Props) {
  const { activeDiagramType } = useLLDWorkspace();
  const [activeNodeTool, setActiveNodeTool] = useState<string | null>(null);

  const tools = DIAGRAM_TOOLS_MAP[activeDiagramType] || { nodes: [], edges: [] };

  useEffect(() => {
    if (!activeNodeTool || !excalidrawAPI) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (e.target instanceof HTMLCanvasElement) {
        e.preventDefault();
        e.stopPropagation();
        
        const appState = excalidrawAPI.getAppState();
        const canvasRect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        const zoom = appState.zoom?.value || 1;
        
        const x = (e.clientX - canvasRect.left) / zoom - appState.scrollX;
        const y = (e.clientY - canvasRect.top) / zoom - appState.scrollY;

        let newElements: any[] = [];
        
        // Map tool to specific generator
        switch (activeNodeTool) {
          case 'Class': newElements = generateClassNode(x, y); break;
          case 'Interface': newElements = generateInterfaceNode(x, y); break;
          case 'AbstractClass': newElements = generateAbstractClassNode(x, y); break;
          case 'Enum': newElements = generateEnumNode(x, y); break;
          case 'Package': newElements = generatePackageNode(x, y); break;
          case 'Note': newElements = generateNoteNode(x, y); break;
          case 'Object': newElements = generateObjectNode(x, y); break;
          case 'Actor': newElements = generateActorNode(x, y); break;
          case 'Lifeline': newElements = generateLifelineNode(x, y); break;
          case 'Activation': newElements = generateActivationNode(x, y); break;
          case 'InitialNode': 
          case 'InitialState': newElements = generateInitialNode(x, y); break;
          case 'FinalNode': 
          case 'FinalState': newElements = generateFinalNode(x, y); break;
          case 'Action': 
          case 'State': newElements = generateActionNode(x, y, activeNodeTool); break;
          case 'Decision': newElements = generateDecisionNode(x, y); break;
          case 'Merge': newElements = generateMergeNode(x, y); break;
          case 'Fork': newElements = generateForkNode(x, y); break;
          case 'Join': newElements = generateJoinNode(x, y); break;
          case 'UseCase': newElements = generateUseCaseNode(x, y); break;
          case 'Component': newElements = generateComponentNode(x, y); break;
          case 'Device': newElements = generateDeviceNode(x, y); break;
          case 'Artifact': newElements = generateArtifactNode(x, y); break;
          // For newly added diagrams, use a generic fallback until fully implemented
          default: newElements = generateGenericNode(x, y, activeNodeTool); break;
        }

        if (newElements.length > 0) {
          import('@excalidraw/excalidraw').then(({ convertToExcalidrawElements }) => {
            const validElements = convertToExcalidrawElements(newElements);
            const currentElements = excalidrawAPI.getSceneElements();
            excalidrawAPI.updateScene({ elements: [...currentElements, ...validElements] });
          }).catch(err => console.error("Error loading Excalidraw utils", err));
        }

        setActiveNodeTool(null);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, { capture: true });
    return () => document.removeEventListener('pointerdown', handlePointerDown, { capture: true });
  }, [activeNodeTool, excalidrawAPI]);

  const handleToolClick = (toolId: string, isEdge: boolean) => {
    if (!excalidrawAPI) return;
    
    if (isEdge) {
      setActiveNodeTool(null);
      let updateState: any = { activeTool: { type: 'arrow' }, currentItemStrokeStyle: "solid", currentItemStartArrowhead: null, currentItemEndArrowhead: "arrow" };
      
      switch (toolId) {
        case 'Association':
          updateState = { ...updateState, currentItemStrokeStyle: "solid", currentItemEndArrowhead: "arrow" };
          break;
        case 'Message':
          updateState = { ...updateState, currentItemStrokeStyle: "solid", currentItemEndArrowhead: "triangle" };
          break;
        case 'ControlFlow':
        case 'Transition':
        case 'CommunicationPath':
          updateState = { ...updateState, currentItemStrokeStyle: "solid", currentItemEndArrowhead: "arrow" };
          break;
        case 'Dependency':
        case 'ReturnMessage':
        case 'Include':
        case 'Extend':
          updateState = { ...updateState, currentItemStrokeStyle: "dashed", currentItemEndArrowhead: "arrow" };
          break;
        case 'Inheritance':
          updateState = { ...updateState, currentItemStrokeStyle: "solid", currentItemEndArrowhead: "triangle_outline" };
          break;
        case 'Realization':
          updateState = { ...updateState, currentItemStrokeStyle: "dashed", currentItemEndArrowhead: "triangle_outline" };
          break;
        case 'Aggregation':
          updateState = { ...updateState, currentItemStrokeStyle: "solid", currentItemStartArrowhead: "diamond_outline", currentItemEndArrowhead: null };
          break;
        case 'Composition':
          updateState = { ...updateState, currentItemStrokeStyle: "solid", currentItemStartArrowhead: "diamond", currentItemEndArrowhead: null };
          break;
        case 'SelfMessage':
          updateState = { ...updateState, currentItemStrokeStyle: "solid", currentItemEndArrowhead: "arrow" }; // Needs custom logic, defaulting to arrow
          break;
      }
      
      excalidrawAPI.updateScene({ appState: updateState });
    } else {
      setActiveNodeTool(activeNodeTool === toolId ? null : toolId);
      excalidrawAPI.updateScene({ appState: { activeTool: { type: 'selection' } } });
    }
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'Class': return <Square size={18} />;
      case 'Interface': return <Type size={18} />;
      case 'AbstractClass': return <Box size={18} />;
      case 'Enum': return <List size={18} />;
      case 'Package': return <Layout size={18} />;
      case 'Note': return <FileText size={18} />;
      
      case 'Actor': return <User size={18} />;
      case 'UseCase': return <Circle size={18} />;
      case 'Lifeline': return <MoveRight size={18} />;
      case 'Activation': return <Layout size={18} />;
      
      case 'InitialNode': 
      case 'InitialState': return <Play size={18} />;
      case 'FinalNode': 
      case 'FinalState': return <StopCircle size={18} />;
      case 'Action': 
      case 'State': return <Square size={18} />;
      case 'Component': return <Box size={18} />;
      case 'Device': return <Box size={18} />;
      case 'Artifact': return <FileText size={18} />;
      case 'Decision': return <HelpCircle size={18} />;
      case 'Merge': 
      case 'Join': return <GitMerge size={18} />;
      case 'Fork': return <Navigation size={18} />;
      
      case 'Association':
      case 'Message':
      case 'ControlFlow':
      case 'CommunicationPath':
      case 'Transition': return <ArrowRight size={18} />;
      case 'Aggregation': return <Focus size={18} />;
      case 'Composition': return <Link size={18} />;
      case 'Dependency':
      case 'ReturnMessage':
      case 'Include':
      case 'Extend': return <MoveRight size={18} />;
      case 'Inheritance': return <CornerDownRight size={18} />;
      case 'Realization': return <GitMerge size={18} />;
      case 'SelfMessage': return <ArrowLeftRight size={18} />;
      default: return <Square size={18} />;
    }
  };

  return (
    <div className="absolute top-[72px] left-1/2 -translate-x-1/2 bg-surface border border-primary/10 rounded-xl shadow-lg px-3 py-2 flex items-center gap-4 z-10 transition-all">
      
      {tools.nodes.length > 0 && (
        <div className={`flex items-center gap-1 ${tools.edges.length > 0 ? 'border-r border-primary/10 pr-4' : ''}`}>
          <div className="text-[10px] uppercase font-bold text-primary/40 mr-2">Nodes</div>
          {tools.nodes.map(tool => (
            <ToolbarButton 
              key={tool.id} 
              icon={getIcon(tool.id)} 
              tooltip={tool.label} 
              isActive={activeNodeTool === tool.id} 
              onClick={() => handleToolClick(tool.id, false)} 
            />
          ))}
        </div>
      )}
      
      {tools.edges.length > 0 && (
        <div className="flex items-center gap-1">
          <div className="text-[10px] uppercase font-bold text-primary/40 mr-2">Edges</div>
          {tools.edges.map(tool => (
            <ToolbarButton 
              key={tool.id} 
              icon={getIcon(tool.id)} 
              tooltip={tool.label} 
              onClick={() => handleToolClick(tool.id, true)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ToolbarButton({ icon, tooltip, isActive, onClick }: { icon: React.ReactNode; tooltip: string; isActive?: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors group relative cursor-pointer ${
        isActive 
          ? "bg-primary/10 text-primary-ink" 
          : "text-primary/70 hover:bg-primary/5 hover:text-primary-ink"
      }`}
      title={tooltip}
    >
      {icon}
      <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-primary-ink text-surface text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
        {tooltip}
      </span>
    </button>
  );
}
