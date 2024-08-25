import { ApplicationConfig, provideZoneChangeDetection, isDevMode, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';


import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { dbConfig } from './my-apps-db.config';
import { MatNativeDateModule } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    importProvidersFrom(MatNativeDateModule),
    importProvidersFrom(NgxIndexedDBModule.forRoot(dbConfig)),
    importProvidersFrom(NgxGoogleAnalyticsModule.forRoot('G-VYXC4WPVFS')),
    importProvidersFrom(NgxGoogleAnalyticsRouterModule.forRoot({include: ['*']})),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000' // Auto-register after 30 seconds of app stability
    })
  ]
};
