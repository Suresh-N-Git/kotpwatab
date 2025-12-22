import { ApplicationConfig, provideZoneChangeDetection, isDevMode, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedDirectiveModule } from './SharedDirectivesModule';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpReqResInterceptor } from './core/http-req-res.interceptor';

import localeIn from '@angular/common/locales/en-IN';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeIn);

import { HomeService } from './homeservice/home.service';
import { DatePipe, DecimalPipe, Location } from '@angular/common';


export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'en-IN' },

    // {
    //   provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    //   useValue: { appearance: 'outline', floatLabel: 'always' }, // Float Labels through out the project
    // },

    importProvidersFrom(FormsModule, ReactiveFormsModule, SharedDirectiveModule, BrowserAnimationsModule),

    provideHttpClient(withInterceptors([HttpReqResInterceptor])),

    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes),

    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    HomeService, // This makes the service available globally
    // AlertService, // This makes the service available globally
    DatePipe,
    DecimalPipe,
    Location
  ]

};


// import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';
// import { provideServiceWorker } from '@angular/service-worker';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// export const appConfig: ApplicationConfig = {
//   providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideServiceWorker('ngsw-worker.js', {
//             enabled: !isDevMode(),
//             registrationStrategy: 'registerWhenStable:30000'
//           }), provideAnimationsAsync()]
// };
