export const generateId = () => Math.random().toString(36).substring(2, 15);

const defaultStyles = {
  strokeColor: "#1e293b",
  backgroundColor: "transparent",
  fillStyle: "hachure",
  strokeWidth: 2,
  strokeStyle: "solid",
  roughness: 0,
  opacity: 100,
  strokeSharpness: "sharp",
  locked: false,
  isDeleted: false,
  boundElements: null,
  link: null,
  version: 1,
  versionNonce: Math.floor(Math.random() * 1000000000),
  seed: Math.floor(Math.random() * 1000000000),
  angle: 0,
  roundness: { type: 3 }, // standard excalidraw roundness
  startBinding: null,
  endBinding: null,
  frameId: null,
};

export function createRectangle(x: number, y: number, width: number, height: number, customProps: any = {}) {
  return {
    id: generateId(),
    type: "rectangle",
    x,
    y,
    width,
    height,
    ...defaultStyles,
    backgroundColor: "#ffffff",
    fillStyle: "solid",
    ...customProps,
  };
}

export function createText(x: number, y: number, text: string, customProps: any = {}) {
  return {
    id: generateId(),
    type: "text",
    x,
    y,
    width: text.length * 10,
    height: 24,
    text,
    fontSize: 16,
    fontFamily: 1, // 1 = Virgil, 2 = Helvetica, 3 = Cascadia
    textAlign: "center",
    verticalAlign: "middle",
    baseline: 18,
    containerId: null,
    originalText: text,
    ...defaultStyles,
    strokeWidth: 1,
    ...customProps,
  };
}

export function createLine(x: number, y: number, dx: number, dy: number, customProps: any = {}) {
  const points = [[0, 0], [dx, dy]];
  
  const minX = Math.min(...points.map(p => p[0]));
  const maxX = Math.max(...points.map(p => p[0]));
  const minY = Math.min(...points.map(p => p[1]));
  const maxY = Math.max(...points.map(p => p[1]));

  return {
    id: generateId(),
    type: "line",
    x: x, // Excalidraw linear elements have x, y at the first point
    y: y,
    width: maxX - minX,
    height: maxY - minY,
    points: points, // [0,0] is guaranteed as points[0] is [0,0]
    ...defaultStyles,
    ...customProps,
  };
}

export function createArrow(x: number, y: number, points: number[][], customProps: any = {}) {
  // Ensure points start at [0,0]
  const startX = points[0][0];
  const startY = points[0][1];
  const normalizedPoints = points.map(p => [p[0] - startX, p[1] - startY]);
  
  const minX = Math.min(...normalizedPoints.map(p => p[0]));
  const maxX = Math.max(...normalizedPoints.map(p => p[0]));
  const minY = Math.min(...normalizedPoints.map(p => p[1]));
  const maxY = Math.max(...normalizedPoints.map(p => p[1]));

  return {
    id: generateId(),
    type: "arrow",
    x,
    y,
    width: maxX - minX,
    height: maxY - minY,
    points: normalizedPoints,
    ...defaultStyles,
    ...customProps,
  };
}

export function createEllipse(x: number, y: number, width: number, height: number, customProps: any = {}) {
  return {
    id: generateId(),
    type: "ellipse",
    x,
    y,
    width,
    height,
    ...defaultStyles,
    backgroundColor: "#ffffff",
    fillStyle: "solid",
    ...customProps,
  };
}

export function createDiamond(x: number, y: number, width: number, height: number, customProps: any = {}) {
  return {
    id: generateId(),
    type: "diamond",
    x,
    y,
    width,
    height,
    ...defaultStyles,
    backgroundColor: "#ffffff",
    fillStyle: "solid",
    ...customProps,
  };
}

export function createImage(x: number, y: number, width: number, height: number, fileId: string, customProps: any = {}) {
  return {
    id: generateId(),
    type: "image",
    x,
    y,
    width,
    height,
    fileId,
    scale: [1, 1],
    ...defaultStyles,
    ...customProps,
  };
}
