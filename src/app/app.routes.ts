import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';
import { SelectCountryPage } from './pages/SelectContry/select-country.page';
import { AppInitPage } from './pages/app-init/app-init.page';

export const routes: Routes = [
  { path: '', component: AppInitPage },  // Aquí empieza la app
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'select-country', component: SelectCountryPage },
  { path: 'menu-sitio/:plato_id', loadComponent: () => import('./pages/menu-sitio/menu-sitio.page').then(m => m.MenuSitioPage) },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  // otras rutas
];
