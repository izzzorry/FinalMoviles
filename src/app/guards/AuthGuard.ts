import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PaisService } from 'src/app/services/pais.service';

@Injectable({ providedIn: 'root' })
export class AppInitService {

  constructor(
    private authService: AuthService,
    private paisService: PaisService,
    private router: Router
  ) {}

  async initApp() {
    const token = await this.authService.getToken();

    // Verifica si hay token, si no, va a login
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // Verifica si hay país seleccionado
    const pais = await this.paisService.getPais();
    if (!pais) {
      this.router.navigate(['/select-country']);
      return;
    }

    // Decodifica el token para obtener el perfil
    const payload = JSON.parse(atob(token.split('.')[1]));
    const perfil = payload.perfil;

    // Redirige según el perfil
    if (perfil === 'Admin') {
      this.router.navigate(['/tabs/tab1']);
    } if (perfil === 'Comun') {
      this.router.navigate(['/tabs/tab1C']);
    }
  }
}
