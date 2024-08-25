import { Component, OnInit } from '@angular/core';
import { ChildrenOutletContexts, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { routeAnimations } from './route-animations';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [routeAnimations]
})
export class AppComponent implements OnInit {
  title = 'my-apps';
  updateAvailable = false;

  constructor(private router: Router, private swUpdate: SwUpdate, private contexts: ChildrenOutletContexts) {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((event: VersionEvent) => {
        if (event.type === 'VERSION_READY') {
          this.updateAvailable = true;
        }
      });
    }
   }

   ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-VYXC4WPVFS', {
          page_path: event.urlAfterRedirects
        });
      }
    });
   }

   updateApp() {
    this.swUpdate.activateUpdate().then(() => document.location.reload());
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
