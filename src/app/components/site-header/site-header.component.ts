import { AsyncPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { siteConfig } from '../../site.config';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, AsyncPipe],
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.css'],
})
export class SiteHeaderComponent {
  readonly site = siteConfig;

  readonly navLinks = [
    { label: 'Blog', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Draw', path: '/draw' },
  ];

  readonly tagline$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    startWith(null),
    map(() => this.currentRouteTagline()),
  );

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  private currentRouteTagline(): string {
    let route = this.route.snapshot;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const tagline = route.data['tagline'];

    return typeof tagline === 'string' ? tagline : this.site.tagline;
  }
}
