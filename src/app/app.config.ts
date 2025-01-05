import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {definePreset, palette} from '@primeng/themes';
export const appConfig: ApplicationConfig = {
  providers:
    [
      provideAnimationsAsync(),
      providePrimeNG({
        theme : {
          preset: definePreset(Aura, {
            semantic: {
              primary: palette("#F4A261")
            },
          }),
        },
        ripple: true
      }),
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes)
    ]
};
