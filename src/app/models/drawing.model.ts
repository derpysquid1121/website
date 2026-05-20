export type DrawingTool = 'pen' | 'eraser';

export interface DrawingPoint {
  /** 0–1 relative to viewport width */
  x: number;
  /** 0–1 relative to viewport height */
  y: number;
}

export interface DrawingStroke {
  points: DrawingPoint[];
}
