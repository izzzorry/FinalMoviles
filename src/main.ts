import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { Storage } from '@ionic/storage-angular';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

async function bootstrap() {
  const storage = new Storage();
  await storage.create();

  bootstrapApplication(AppComponent, {
    providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideIonicAngular(),
      provideRouter(routes, withPreloading(PreloadAllModules)),
      importProvidersFrom(HttpClientModule),
      { provide: Storage, useValue: storage },
    ],
  });
}

bootstrap();
