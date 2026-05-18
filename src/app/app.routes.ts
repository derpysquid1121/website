import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { BlogComponent } from './pages/blog/blog.component';

export const routes: Routes = [
  { path: '', component: BlogComponent, title: 'Music blog' },
  { path: 'about', component: AboutComponent, title: 'About' },
  { path: '**', redirectTo: '' },
];
