import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DrawingPoint, DrawingStroke, DrawingTool } from '../models/drawing.model';

const ERASER_RADIUS_PX = 22;
const STORAGE_KEY = 'davidblackburn.site.drawing';

@Injectable({ providedIn: 'root' })
export class DrawingService {
  private readonly strokesSubject = new BehaviorSubject<DrawingStroke[]>(this.loadFromStorage());
  private readonly drawingEnabledSubject = new BehaviorSubject(false);
  private readonly toolSubject = new BehaviorSubject<DrawingTool>('pen');

  readonly strokes$ = this.strokesSubject.asObservable();
  readonly drawingEnabled$ = this.drawingEnabledSubject.asObservable();
  readonly tool$ = this.toolSubject.asObservable();

  private currentStroke: DrawingStroke | null = null;

  get strokes(): DrawingStroke[] {
    return this.strokesSubject.value;
  }

  get drawingEnabled(): boolean {
    return this.drawingEnabledSubject.value;
  }

  get tool(): DrawingTool {
    return this.toolSubject.value;
  }

  setDrawingEnabled(enabled: boolean): void {
    this.drawingEnabledSubject.next(enabled);

    if (!enabled) {
      this.currentStroke = null;
    }
  }

  setTool(tool: DrawingTool): void {
    this.toolSubject.next(tool);
    this.currentStroke = null;
  }

  startStroke(point: DrawingPoint): void {
    this.currentStroke = { points: [point] };
    this.strokesSubject.next([...this.strokes, this.currentStroke]);
  }

  extendStroke(point: DrawingPoint): void {
    if (!this.currentStroke) {
      return;
    }

    this.currentStroke.points.push(point);
    this.strokesSubject.next([...this.strokes]);
  }

  endStroke(): void {
    this.currentStroke = null;
  }

  eraseAt(point: DrawingPoint, radiusPx = ERASER_RADIUS_PX): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const px = point.x * width;
    const py = point.y * height;
    const radiusSq = radiusPx * radiusPx;

    const nextStrokes: DrawingStroke[] = [];

    for (const stroke of this.strokes) {
      if (stroke === this.currentStroke) {
        continue;
      }

      let segment: DrawingPoint[] = [];

      for (const p of stroke.points) {
        const dx = p.x * width - px;
        const dy = p.y * height - py;
        const insideEraser = dx * dx + dy * dy <= radiusSq;

        if (!insideEraser) {
          segment.push(p);
        } else if (segment.length > 0) {
          this.pushSegment(nextStrokes, segment);
          segment = [];
        }
      }

      if (segment.length > 0) {
        this.pushSegment(nextStrokes, segment);
      }
    }

    this.strokesSubject.next(nextStrokes);
    this.currentStroke = null;
  }

  clear(): void {
    this.currentStroke = null;
    this.strokesSubject.next([]);
    this.saveToStorage();
  }

  saveToStorage(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      const strokes = this.strokes
        .filter((stroke) => stroke.points.length >= 2)
        .map((stroke) => ({
          points: stroke.points.map((point) => ({ x: point.x, y: point.y })),
        }));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(strokes));
    } catch {
      // Ignore quota or privacy errors.
    }
  }

  pointFromClient(clientX: number, clientY: number): DrawingPoint {
    return {
      x: clientX / window.innerWidth,
      y: clientY / window.innerHeight,
    };
  }

  private pushSegment(strokes: DrawingStroke[], points: DrawingPoint[]): void {
    if (points.length >= 2) {
      strokes.push({ points: [...points] });
    }
  }

  private loadFromStorage(): DrawingStroke[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return [];
      }

      const parsed: unknown = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter((stroke): stroke is DrawingStroke => this.isValidStroke(stroke));
    } catch {
      return [];
    }
  }

  private isValidStroke(value: unknown): value is DrawingStroke {
    if (!value || typeof value !== 'object' || !('points' in value)) {
      return false;
    }

    const points = (value as DrawingStroke).points;

    if (!Array.isArray(points) || points.length < 2) {
      return false;
    }

    return points.every(
      (point) =>
        typeof point.x === 'number' &&
        typeof point.y === 'number' &&
        point.x >= 0 &&
        point.x <= 1 &&
        point.y >= 0 &&
        point.y <= 1,
    );
  }
}
