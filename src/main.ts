import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// 👇 imports para idioma
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { NZ_I18N, es_ES } from 'ng-zorro-antd/i18n';

// registrar español en Angular
registerLocaleData(es);

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: NZ_I18N, useValue: es_ES }
  ]
}).catch((err) => console.error(err));