import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { BlogComponent } from './pages/blog/blog.component';
import { siteConfig } from './site.config';

export const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
    title: 'Music',
    data: { tagline: siteConfig.tagline },
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About',
    data: { tagline: `about me!` },
  },
  { path: '**', redirectTo: '' },
];
