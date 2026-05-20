import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DrawingService } from '../../services/drawing.service';

const IRIDESCENT_COLORS = [
  '#ff8ec8',
  '#c98bff',
  '#7ec8ff',
  '#5dffa8',
  '#ffe08a',
  '#ff8ec8',
];

const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, label, [role="button"], .draw-toolbar, .draw-tool';

@Component({
  selector: 'app-drawing-overlay',
  standalone: true,
  templateUrl: './drawing-overlay.component.html',
  styleUrls: ['./drawing-overlay.component.css'],
})
export class DrawingOverlayComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private gradientPhase = 0;
  private rafId = 0;
  private drawing = false;
  private drawingEnabledSub?: Subscription;
  private toolSub?: Subscription;
  private strokesSub?: Subscription;

  private readonly onDocumentPointerDown = (event: PointerEvent) =>
    this.handlePointerDown(event);
  private readonly onDocumentPointerMove = (event: PointerEvent) =>
    this.handlePointerMove(event);
  private readonly onDocumentPointerUp = (event: PointerEvent) =>
    this.handlePointerUp(event);

  constructor(private readonly drawingService: DrawingService) {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    this.resizeCanvas();
    window.addEventListener('resize', this.onResize);

    this.strokesSub = this.drawingService.strokes$.subscribe(() => this.redraw());
    this.drawingEnabledSub = this.drawingService.drawingEnabled$.subscribe((enabled) => {
      if (enabled) {
        this.enableDocumentDrawing();
      } else {
        this.disableDocumentDrawing();
      }
    });

    this.toolSub = this.drawingService.tool$.subscribe((tool) => {
      document.body.classList.toggle('eraser-mode', tool === 'eraser');
    });

    if (this.drawingService.drawingEnabled) {
      this.enableDocumentDrawing();
    }

    document.body.classList.toggle('eraser-mode', this.drawingService.tool === 'eraser');

    this.startAnimation();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    this.disableDocumentDrawing();
    this.strokesSub?.unsubscribe();
    this.drawingEnabledSub?.unsubscribe();
    this.toolSub?.unsubscribe();
  }

  private enableDocumentDrawing(): void {
    document.addEventListener('pointerdown', this.onDocumentPointerDown);
    document.addEventListener('pointermove', this.onDocumentPointerMove);
    document.addEventListener('pointerup', this.onDocumentPointerUp);
    document.addEventListener('pointercancel', this.onDocumentPointerUp);
    document.body.classList.add('drawing-mode');
  }

  private disableDocumentDrawing(): void {
    document.removeEventListener('pointerdown', this.onDocumentPointerDown);
    document.removeEventListener('pointermove', this.onDocumentPointerMove);
    document.removeEventListener('pointerup', this.onDocumentPointerUp);
    document.removeEventListener('pointercancel', this.onDocumentPointerUp);
    document.body.classList.remove('drawing-mode', 'eraser-mode');
    this.drawing = false;
  }

  private handlePointerDown(event: PointerEvent): void {
    if (!this.drawingService.drawingEnabled || this.isInteractiveTarget(event.target)) {
      return;
    }

    event.preventDefault();
    this.drawing = true;
    const point = this.drawingService.pointFromClient(event.clientX, event.clientY);

    if (this.drawingService.tool === 'eraser') {
      this.drawingService.eraseAt(point);
      return;
    }

    this.drawingService.startStroke(point);
  }

  private handlePointerMove(event: PointerEvent): void {
    if (!this.drawing || !this.drawingService.drawingEnabled) {
      return;
    }

    event.preventDefault();
    const point = this.drawingService.pointFromClient(event.clientX, event.clientY);

    if (this.drawingService.tool === 'eraser') {
      this.drawingService.eraseAt(point);
      return;
    }

    this.drawingService.extendStroke(point);
    this.redraw();
  }

  private handlePointerUp(event: PointerEvent): void {
    if (!this.drawing) {
      return;
    }

    this.drawing = false;

    if (this.drawingService.tool === 'pen') {
      this.drawingService.endStroke();
    }
  }

  private isInteractiveTarget(target: EventTarget | null): boolean {
    return target instanceof Element && !!target.closest(INTERACTIVE_SELECTOR);
  }

  private onResize = (): void => {
    this.resizeCanvas();
  };

  private startAnimation(): void {
    const tick = (time: number) => {
      this.gradientPhase = (time / 7000) % 1;
      this.redraw();
      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.redraw();
  }

  private strokeGradient(logicalWidth: number): CanvasGradient {
    const period = logicalWidth * 2.2;
    const offset = this.gradientPhase * period;
    const gradient = this.ctx.createLinearGradient(-offset, 0, period - offset, 0);

    IRIDESCENT_COLORS.forEach((color, index) => {
      gradient.addColorStop(index / (IRIDESCENT_COLORS.length - 1), color);
    });

    return gradient;
  }

  private redraw(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    this.ctx.clearRect(0, 0, width, height);
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = this.strokeGradient(width);

    for (const stroke of this.drawingService.strokes) {
      if (stroke.points.length < 2) {
        continue;
      }

      this.ctx.beginPath();
      this.ctx.moveTo(stroke.points[0].x * width, stroke.points[0].y * height);

      for (let i = 1; i < stroke.points.length; i++) {
        const point = stroke.points[i];
        this.ctx.lineTo(point.x * width, point.y * height);
      }

      this.ctx.stroke();
    }
  }
}
