// src/app/pages/profile/profile.page.ts

import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { URL_Back } from 'src/app/config/url.servicios';

import { addIcons } from 'ionicons';
import { personCircleOutline, starOutline, bookmarkOutline } from 'ionicons/icons';

addIcons({
  personCircleOutline,
  starOutline,
  bookmarkOutline
});

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  public URL_Back = URL_Back;
  public userId = '';
  public perfil = '';
  public myTags: any[] = [];
  public topUsersWithTags: Array<{ userName: string; tagCount: number }> = [];
  public loading = true;

  // Aquí guardaremos el detalle de cada sitio favorito
  public sitiosFavoritosDetalle: Array<{
    _id: string;
    nombre: string;
    ciudad_id: { nombre: string };
    tipo?: string;
    imageUrl?: string;
  }> = [];

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  async ngOnInit() {
    // 1) Validar token
    const token = await this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    try {
      const payload: any = JSON.parse(atob(token.split('.')[1]));
      this.userId = payload.userId;
      this.perfil = payload.perfil;
    } catch (err) {
      console.error('Error decodificando token:', err);
      await this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }

    // 2) Carga de “mis tags” y “top users with tags”
    await Promise.all([
      this.loadMyTags(token),
      this.loadTopUsersWithTags(token)
    ]);

    // 3) Carga de “sitios favoritos” (solo IDs) desde localStorage y luego detalle
    this.cargarSitiosFavoritosDesdeLocalStorage();

    this.loading = false;
  }

  private async loadMyTags(token: string) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http
      .get<any[]>(`${URL_Back}/tags/por-usuario/${this.userId}`, { headers })
      .subscribe({
        next: (res) => {
          this.myTags = res;
        },
        error: (err) => {
          console.error('Error cargando mis tags:', err);
        }
      });
  }

  private async loadTopUsersWithTags(token: string) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http
      .get<any[]>(`${URL_Back}/queries/top-users-with-tags`, { headers })
      .subscribe({
        next: (res) => {
          this.topUsersWithTags = res.map(u => ({
            userName: u.userName,
            tagCount: u.tagCount
          }));
        },
        error: (err) => {
          console.error('Error cargando top users with tags:', err);
        }
      });
  }

  /**
   * Paso 1: Lee de localStorage la lista de IDs de sitios favoritos.
   * Paso 2: Por cada ID, hace GET a /api/sites/:id y guarda el resultado en 'sitiosFavoritosDetalle'.
   */
  private cargarSitiosFavoritosDesdeLocalStorage() {
    const raw = localStorage.getItem('sitiosFavoritos');
    const favoritosIds: string[] = raw ? JSON.parse(raw) : [];

    // Si no hay IDs, devolvemos array vacío
    if (!favoritosIds.length) {
      this.sitiosFavoritosDetalle = [];
      return;
    }

    // Limpiamos el array antes de poblarlo
    this.sitiosFavoritosDetalle = [];

    // Por cada ID, hacemos un GET
    favoritosIds.forEach(sitioId => {
      this.http
        .get<any>(`${URL_Back}/sites/${sitioId}`)
        .subscribe({
          next: (sitioData) => {
            // Asegurarse de no duplicar en caso de múltiples llamadas simultáneas
            const yaExiste = this.sitiosFavoritosDetalle.some(s => s._id === sitioData._id);
            if (!yaExiste) {
              this.sitiosFavoritosDetalle.push(sitioData);
            }
          },
          error: (err) => {
            console.error(`No se pudo cargar sitio ${sitioId}:`, err);
            // Opcionalmente, podrías eliminar del array localStorage los IDs que ya no existan:
            //   (p.ej. si err.status === 404)
          }
        });
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
