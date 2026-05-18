import { Component } from '@angular/core';
import { siteConfig } from '../../site.config';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.css'],
})
export class SiteFooterComponent {
  readonly site = siteConfig;
  readonly year = new Date().getFullYear();
}
