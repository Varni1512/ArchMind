import { generateId, createRectangle, createText, createLine, createEllipse, createDiamond } from '../utils/elementGenerator';

// --- CLASS DIAGRAM ---

export function generateClassNode(
  x: number, 
  y: number, 
  name: string = "ClassName",
  attributes: string[] = ["+ attribute: type"],
  methods: string[] = ["+ method(): returnType"],
  stereotype: string | null = null, 
  isAbstract: boolean = false
) {
  const groupId = generateId();
  
  const hasAttributes = attributes && attributes.length > 0;
  const hasMethods = methods && methods.length > 0;

  const maxTextLength = Math.max(
    name.length + (stereotype ? stereotype.length + 4 : 0),
    hasAttributes ? Math.max(...attributes.map(a => a.length)) : 0,
    hasMethods ? Math.max(...methods.map(m => m.length)) : 0
  );
  const width = Math.max(200, maxTextLength * 8 + 40);

  const headerHeight = stereotype ? 60 : 40;
  const attrHeight = hasAttributes ? Math.max(40, attributes.length * 24 + 16) : 0;
  const methodHeight = hasMethods ? Math.max(40, methods.length * 24 + 16) : 0;

  const titleText = stereotype ? `<<${stereotype}>>\n${name}` : name;

  const elements = [];
  const customData = { diagramType: 'Class Diagram', nodeType: stereotype || 'Class' };

  // Header
  elements.push(createRectangle(x, y, width, headerHeight, { groupIds: [groupId], customData }));
  elements.push(createText(x + width / 2, y + headerHeight / 2, titleText, {
    groupIds: [groupId],
    fontSize: 16,
    fontFamily: 1, 
    strokeWidth: isAbstract ? 1 : 2,
    textAlign: "center"
  }));

  let currentY = y + headerHeight;

  // Attributes Rectangle
  if (hasAttributes) {
    const attributesText = attributes.join("\n");
    elements.push(createRectangle(x, currentY, width, attrHeight, { groupIds: [groupId] }));
    elements.push(createText(x + 10, currentY + attrHeight / 2, attributesText, {
      groupIds: [groupId],
      fontSize: 14,
      fontFamily: 1,
      textAlign: "left",
    }));
    currentY += attrHeight;
  }

  // Methods Rectangle
  if (hasMethods || (!hasAttributes && !hasMethods)) { 
    // Always render at least a methods block if it's completely empty just to have a box, 
    // or if it has methods.
    const methodsText = methods.join("\n") || " ";
    const actualMethodHeight = hasMethods ? methodHeight : 40;
    elements.push(createRectangle(x, currentY, width, actualMethodHeight, { groupIds: [groupId] }));
    elements.push(createText(x + 10, currentY + actualMethodHeight / 2, methodsText, {
      groupIds: [groupId],
      fontSize: 14,
      fontFamily: 1,
      textAlign: "left",
    }));
  }

  return elements;
}

export function generateInterfaceNode(x: number, y: number, name: string = "Interface", methods: string[] = ["+ method(): returnType"]) {
  return generateClassNode(x, y, name, [], methods, "interface");
}

export function generateAbstractClassNode(x: number, y: number, name: string = "AbstractClass", attributes: string[] = [], methods: string[] = ["+ abstractMethod(): void", "+ method(): returnType"]) {
  return generateClassNode(x, y, name, attributes, methods, "abstract", true);
}

export function generateEnumNode(x: number, y: number) {
  const groupId = generateId();
  const width = 160;
  const headerHeight = 60;
  const bodyHeight = 80;

  const elements = [];
  const customData = { diagramType: 'Class Diagram', nodeType: 'Enum' };

  // Header Rectangle
  elements.push(createRectangle(x, y, width, headerHeight, { groupIds: [groupId], customData }));
  elements.push(createText(x + width / 2, y + headerHeight / 2, "<<enum>>\nEnumName", {
    groupIds: [groupId],
    fontSize: 16,
    fontFamily: 1,
    textAlign: "center"
  }));

  // Body Rectangle
  const bodyY = y + headerHeight;
  elements.push(createRectangle(x, bodyY, width, bodyHeight, { groupIds: [groupId] }));
  elements.push(createText(x + 10, bodyY + bodyHeight / 2, "VALUE_1\nVALUE_2\nVALUE_3", {
    groupIds: [groupId],
    fontSize: 14,
    fontFamily: 1,
    textAlign: "left",
  }));

  return elements;
}

export function generatePackageNode(x: number, y: number) {
  const groupId = generateId();
  const elements = [];
  
  const tabWidth = 60;
  const tabHeight = 20;
  const bodyWidth = 160;
  const bodyHeight = 100;
  
  const customData = { diagramType: 'Package Diagram', nodeType: 'Package' };

  elements.push(createRectangle(x, y, tabWidth, tabHeight, { groupIds: [groupId], customData }));
  elements.push(createRectangle(x, y + tabHeight, bodyWidth, bodyHeight, { groupIds: [groupId] }));
  
  elements.push(createText(x + bodyWidth / 2, y + tabHeight + bodyHeight / 2, "PackageName", {
    groupIds: [groupId],
    fontSize: 16,
    fontFamily: 1,
  }));

  return elements;
}

export function generateNoteNode(x: number, y: number, text: string = "This is\na note...") {
  const groupId = generateId();
  const width = Math.max(160, Math.max(...text.split('\n').map(l => l.length)) * 10);
  const height = Math.max(100, text.split('\n').length * 20 + 40);
  const elements = [];
  
  const customData = { diagramType: 'Generic', nodeType: 'Note' };

  elements.push(createRectangle(x, y, width, height, { 
    groupIds: [groupId],
    backgroundColor: "#fef08a", // yellow note
    fillStyle: "solid",
    roughness: 1, // Make it look a bit like paper
    customData
  }));

  elements.push(createText(x + width / 2, y + height / 2, text, {
    groupIds: [groupId],
    fontSize: 16,
    fontFamily: 1, // Virgil
  }));

  return elements;
}

// --- OBJECT DIAGRAM ---

export function generateObjectNode(x: number, y: number, name: string = "object1 : ClassName", attributes: string[] = ["attribute1 = value1", "attribute2 = value2"]) {
  const groupId = generateId();
  
  const maxTextLength = Math.max(name.length, ...attributes.map(a => a.length));
  const width = Math.max(160, maxTextLength * 8 + 40);
  const headerHeight = 40;
  const attrHeight = Math.max(40, attributes.length * 24 + 16);

  const elements = [];
  const customData = { diagramType: 'Object Diagram', nodeType: 'Object' };

  elements.push(createRectangle(x, y, width, headerHeight, { groupIds: [groupId], customData }));
  elements.push(createText(x + width / 2, y + headerHeight / 2, name, {
    groupIds: [groupId],
    fontSize: 16,
    fontFamily: 1, 
    textAlign: "center"
  }));

  const attrY = y + headerHeight;
  elements.push(createRectangle(x, attrY, width, attrHeight, { groupIds: [groupId] }));
  elements.push(createText(x + 10, attrY + attrHeight / 2, attributes.join("\n") || " ", {
    groupIds: [groupId],
    fontSize: 14,
    fontFamily: 1,
    textAlign: "left",
  }));

  return elements;
}

// --- SEQUENCE & USE CASE DIAGRAM ---

export function generateActorNode(x: number, y: number, name: string = "Actor") {
  const groupId = generateId();
  const elements = [];
  const customData = { diagramType: 'Sequence/UseCase Diagram', nodeType: 'Actor' };

  // Stick figure dimensions
  const headSize = 30;
  const bodyLen = 40;
  const armSpan = 40;
  const legSpan = 40;

  // Head
  elements.push(createEllipse(x, y, headSize, headSize, { groupIds: [groupId], customData, backgroundColor: "transparent" }));
  
  // Body
  const bodyTop = y + headSize;
  const bodyBottom = bodyTop + bodyLen;
  const centerX = x + headSize / 2;
  elements.push(createLine(centerX, bodyTop, 0, bodyLen, { groupIds: [groupId] }));
  
  // Arms
  const armY = bodyTop + 10;
  elements.push(createLine(centerX - armSpan / 2, armY, armSpan, 0, { groupIds: [groupId] }));
  
  // Legs
  elements.push(createLine(centerX, bodyBottom, -legSpan / 2, legSpan, { groupIds: [groupId] }));
  elements.push(createLine(centerX, bodyBottom, legSpan / 2, legSpan, { groupIds: [groupId] }));

  // Label
  elements.push(createText(centerX, bodyBottom + legSpan + 15, name, {
    groupIds: [groupId],
    fontSize: 16,
    fontFamily: 1,
    textAlign: "center"
  }));

  return elements;
}

export function generateLifelineNode(x: number, y: number) {
  const groupId = generateId();
  const elements = [];
  const width = 100;
  const height = 40;
  const lineLength = 300;
  const customData = { diagramType: 'Sequence Diagram', nodeType: 'Lifeline' };

  elements.push(createRectangle(x, y, width, height, { groupIds: [groupId], customData }));
  elements.push(createText(x + width / 2, y + height / 2, ":Boundary", {
    groupIds: [groupId],
    fontSize: 16,
    fontFamily: 1,
    textAlign: "center"
  }));

  // Dashed line down
  elements.push(createLine(x + width / 2, y + height, 0, lineLength, { 
    groupIds: [groupId], 
    strokeStyle: "dashed" 
  }));

  return elements;
}

export function generateActivationNode(x: number, y: number) {
  const groupId = generateId();
  const width = 16;
  const height = 100;
  const customData = { diagramType: 'Sequence Diagram', nodeType: 'Activation' };

  return [createRectangle(x, y, width, height, { groupIds: [groupId], customData })];
}

// --- ACTIVITY & STATE DIAGRAM ---

export function generateInitialNode(x: number, y: number) {
  const groupId = generateId();
  const size = 24;
  const customData = { diagramType: 'Activity/State Diagram', nodeType: 'InitialNode' };

  return [
    createEllipse(x, y, size, size, { 
      groupIds: [groupId], 
      backgroundColor: "#000000", 
      fillStyle: "solid",
      customData 
    })
  ];
}

export function generateFinalNode(x: number, y: number) {
  const groupId = generateId();
  const outerSize = 32;
  const innerSize = 20;
  const customData = { diagramType: 'Activity/State Diagram', nodeType: 'FinalNode' };

  const elements = [];
  // Outer circle
  elements.push(createEllipse(x, y, outerSize, outerSize, { groupIds: [groupId], customData }));
  // Inner filled circle
  const offset = (outerSize - innerSize) / 2;
  elements.push(createEllipse(x + offset, y + offset, innerSize, innerSize, { 
    groupIds: [groupId],
    backgroundColor: "#000000",
    fillStyle: "solid" 
  }));

  return elements;
}

export function generateActionNode(x: number, y: number, name: string = "Action") {
  const groupId = generateId();
  const width = Math.max(120, name.length * 10 + 40);
  const height = 40;
  const customData = { diagramType: 'Activity/State Diagram', nodeType: 'Action/State' };

  const elements = [];
  elements.push(createRectangle(x, y, width, height, { 
    groupIds: [groupId], 
    roundness: { type: 3 }, // Rounded rectangle
    customData 
  }));
  elements.push(createText(x + width / 2, y + height / 2, name, {
    groupIds: [groupId],
    fontSize: 16,
    fontFamily: 1,
    textAlign: "center"
  }));

  return elements;
}

export function generateDecisionNode(x: number, y: number, label: string = "Decision") {
  const groupId = generateId();
  const width = 80;
  const height = 50;
  const customData = { diagramType: 'Activity Diagram', nodeType: 'Decision' };

  const elements = [];
  elements.push(createDiamond(x, y, width, height, { groupIds: [groupId], customData }));
  elements.push(createText(x + width / 2, y + height / 2 + 30, label, {
    groupIds: [groupId],
    fontSize: 14,
    fontFamily: 1,
    textAlign: "center"
  }));

  return elements;
}

export function generateMergeNode(x: number, y: number) {
  const groupId = generateId();
  const width = 80;
  const height = 50;
  const customData = { diagramType: 'Activity Diagram', nodeType: 'Merge' };
  return [createDiamond(x, y, width, height, { groupIds: [groupId], customData })];
}

export function generateForkNode(x: number, y: number) {
  const groupId = generateId();
  const width = 120;
  const height = 8;
  const customData = { diagramType: 'Activity Diagram', nodeType: 'Fork/Join' };

  return [createRectangle(x, y, width, height, { 
    groupIds: [groupId],
    backgroundColor: "#000000",
    fillStyle: "solid",
    customData
  })];
}

export function generateJoinNode(x: number, y: number) {
  return generateForkNode(x, y); // Fork and Join are the same visual shape
}

// --- USE CASE DIAGRAM ---

export function generateUseCaseNode(x: number, y: number, name: string = "Use Case") {
  const groupId = generateId();
  const width = Math.max(140, name.length * 10 + 40);
  const height = 60;
  const customData = { diagramType: 'Use Case Diagram', nodeType: 'UseCase' };

  const elements = [];
  elements.push(createEllipse(x, y, width, height, { groupIds: [groupId], customData }));
  elements.push(createText(x + width / 2, y + height / 2, name, {
    groupIds: [groupId],
    fontSize: 16,
    fontFamily: 1,
    textAlign: "center"
  }));

  return elements;
}

// --- COMPONENT DIAGRAM ---

export function generateComponentNode(x: number, y: number, name: string = "Component") {
  const groupId = generateId();
  const width = Math.max(160, name.length * 10 + 40);
  const height = 80;
  const customData = { diagramType: 'Component Diagram', nodeType: 'Component' };
  
  const elements = [];
  
  // Main body
  elements.push(createRectangle(x, y, width, height, { groupIds: [groupId], customData }));
  
  // Stereotype & Name
  elements.push(createText(x + width / 2, y + height / 2, `<<component>>\n${name}`, {
    groupIds: [groupId],
    fontSize: 16,
    fontFamily: 1,
    textAlign: "center"
  }));
  
  // 2 small rectangles on the left border
  const boxWidth = 20;
  const boxHeight = 12;
  const boxX = x - boxWidth / 2;
  
  elements.push(createRectangle(boxX, y + height / 3 - boxHeight / 2, boxWidth, boxHeight, { groupIds: [groupId] }));
  elements.push(createRectangle(boxX, y + 2 * height / 3 - boxHeight / 2, boxWidth, boxHeight, { groupIds: [groupId] }));

  return elements;
}

// --- DEPLOYMENT DIAGRAM ---

export function generateDeviceNode(x: number, y: number, name: string = "Device") {
  const groupId = generateId();
  const width = Math.max(200, name.length * 10 + 60);
  const height = 160;
  const customData = { diagramType: 'Deployment Diagram', nodeType: 'Device' };
  
  const elements = [];
  
  // Front face
  elements.push(createRectangle(x, y, width, height, { groupIds: [groupId], customData }));
  
  // Depth offset for 3D effect
  const dx = 20;
  const dy = -20;
  
  // Top face lines
  elements.push(createLine(x, y, dx, dy, { groupIds: [groupId] })); // Top-Left to Back-Top-Left
  elements.push(createLine(x + dx, y + dy, width, 0, { groupIds: [groupId] })); // Back-Top-Left to Back-Top-Right
  elements.push(createLine(x + width, y, dx, dy, { groupIds: [groupId] })); // Top-Right to Back-Top-Right
  
  // Right face lines
  elements.push(createLine(x + width + dx, y + dy, 0, height, { groupIds: [groupId] })); // Back-Top-Right to Back-Bottom-Right
  elements.push(createLine(x + width, y + height, dx, dy, { groupIds: [groupId] })); // Bottom-Right to Back-Bottom-Right

  // Text
  elements.push(createText(x + width / 2, y + 30, `<<device>>\n${name}`, {
    groupIds: [groupId],
    fontSize: 16,
    fontFamily: 1,
    textAlign: "center"
  }));

  return elements;
}

export function generateArtifactNode(x: number, y: number, name: string = "Artifact") {
  const groupId = generateId();
  const width = Math.max(140, name.length * 10 + 40);
  const height = 60;
  const customData = { diagramType: 'Deployment Diagram', nodeType: 'Artifact' };

  const elements = [];
  elements.push(createRectangle(x, y, width, height, { groupIds: [groupId], customData }));
  elements.push(createText(x + width / 2, y + height / 2, `<<artifact>>\n${name}`, {
    groupIds: [groupId],
    fontSize: 16,
    fontFamily: 1,
    textAlign: "center"
  }));

  return elements;
}
