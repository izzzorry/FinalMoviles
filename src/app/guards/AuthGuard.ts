import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';  // tu servicio auth
import { PaisService } from 'src/app/services/pais.service';  // tu servicio pais

@Injectable({ providedIn: 'root' })
export class AppInitService {

  constructor(
    private authService: AuthService,
    private paisService: PaisService,
    private router: Router
  ) {}

  async initApp() {
    const token = await this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const pais = await this.paisService.getPais();
    if (!pais) {
      this.router.navigate(['/select-country']);
      return;
    }

    this.router.navigate(['/tab1']);
  }
}
