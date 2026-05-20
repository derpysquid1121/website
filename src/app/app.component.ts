import { ChangeDetectorRef, Component, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';
import { SiteHeaderComponent } from './components/site-header/site-header.component';
import { BlogComponent } from './pages/blog/blog.component';
import { DrawingOverlayComponent } from './components/drawing-overlay/drawing-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SiteHeaderComponent,
    SiteFooterComponent,
    BlogComponent,
    DrawingOverlayComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  isBlogRoute: boolean;

  constructor(
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.isBlogRoute = this.isHomeRoute(this.router.url);
  }

  ngAfterViewInit(): void {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    ).subscribe((e) => {
      const showBlog = this.isHomeRoute(e.urlAfterRedirects);
      if (showBlog !== this.isBlogRoute) {
        this.isBlogRoute = showBlog;
        this.cdr.detectChanges();
      }
    });
  }

  private isHomeRoute(url: string): boolean {
    const path = url.split('?')[0].split('#')[0];
    return path === '/' || path === '';
  }
}
