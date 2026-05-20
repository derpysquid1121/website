import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DrawingTool } from '../../models/drawing.model';
import { DrawingService } from '../../services/drawing.service';

@Component({
  selector: 'app-draw',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.css'],
})
export class DrawComponent implements OnInit, OnDestroy {
  readonly tool$ = this.drawingService.tool$;

  constructor(private readonly drawingService: DrawingService) {}

  ngOnInit(): void {
    this.drawingService.setDrawingEnabled(true);
  }

  ngOnDestroy(): void {
    this.drawingService.endStroke();
    this.drawingService.saveToStorage();
    this.drawingService.setDrawingEnabled(false);
    this.drawingService.setTool('pen');
  }

  setTool(tool: DrawingTool): void {
    this.drawingService.setTool(tool);
  }

  clear(): void {
    this.drawingService.clear();
  }
}
