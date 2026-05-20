import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { DrawComponent } from './pages/draw/draw.component';
import { siteConfig } from './site.config';

@Component({ selector: 'ng-null', standalone: true, template: '' })
class NullRouteComponent {}

export const routes: Routes = [
  {
    path: '',
    component: NullRouteComponent,
    title: 'Music',
    data: { tagline: siteConfig.tagline },
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About',
    data: { tagline: `about me!` },
  },
  {
    path: 'draw',
    component: DrawComponent,
    title: 'Draw',
    data: { tagline: 'draw something' },
  },
  { path: '**', redirectTo: '' },
];
