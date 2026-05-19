import { ChangeDetectorRef, Component, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';
import { SiteHeaderComponent } from './components/site-header/site-header.component';
import { BlogComponent } from './pages/blog/blog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent, BlogComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  isBlogRoute: boolean;

  constructor(
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.isBlogRoute = !this.router.url.startsWith('/about');
  }

  ngAfterViewInit(): void {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    ).subscribe((e) => {
      const onAbout = e.urlAfterRedirects.startsWith('/about');
      const changed = onAbout === this.isBlogRoute;
      if (changed) {
        this.isBlogRoute = !onAbout;
        this.cdr.detectChanges();
      }
    });
  }
}
