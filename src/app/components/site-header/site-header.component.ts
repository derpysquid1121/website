import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { siteConfig } from '../../site.config';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor],
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.css'],
})
export class SiteHeaderComponent {
  readonly site = siteConfig;

  readonly navLinks = [
    { label: 'Blog', path: '/' },
    { label: 'About', path: '/about' },
  ];
}
