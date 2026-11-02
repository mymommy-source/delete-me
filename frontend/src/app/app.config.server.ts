import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideServerApi } from './core/api/api-url.interceptor';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideServerApi((process.env['API_INTERNAL_URL'] ?? 'http://localhost:3000/api').replace(/\/$/, '')),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
