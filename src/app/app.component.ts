import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';
import { SiteHeaderComponent } from './components/site-header/site-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private canvas!: HTMLCanvasElement;
  private resizeHandler = () => this.draw();

  ngAfterViewInit() {
    this.canvas = document.createElement('canvas');
    Object.assign(this.canvas.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '0',
      pointerEvents: 'none',
    });
    document.body.prepend(this.canvas);
    this.draw();
    window.addEventListener('resize', this.resizeHandler);
  }

  private draw() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    const ctx = this.canvas.getContext('2d')!;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const cx = W / 2;
    const vpY = H * 0.38; // vanishing point

    ctx.fillStyle = '#0c0c0f';
    ctx.fillRect(0, 0, W, H);

    const N = 30;
    for (let i = 0; i <= N; i++) {
      const xEnd = W * (-0.25 + i * 1.5 / N);
      const distFromCenter = Math.abs(xEnd - cx) / (W * 0.75);
      const fade = Math.max(0, 1 - distFromCenter * 0.65);

      const grad = ctx.createLinearGradient(cx, vpY, xEnd, H * 1.04);
      grad.addColorStop(0, 'rgba(30,215,96,0)');
      grad.addColorStop(0.45, `rgba(30,215,96,${0.07 * fade})`);
      grad.addColorStop(1, `rgba(30,215,96,${0.24 * fade})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(0.4, 1.4 * fade);
      ctx.beginPath();
      ctx.moveTo(cx, vpY);
      ctx.lineTo(xEnd, H * 1.04);
      ctx.stroke();
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeHandler);
    this.canvas?.remove();
  }
}
