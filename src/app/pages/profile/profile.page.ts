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
  public URL_Back: string = URL_Back;
  public userId: string = '';
  public perfil: string = '';
  public myTags: Array<any> = [];
  public topUsersWithTags: Array<{ userName: string; tagCount: number }> = [];
  public loading: boolean = true;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  async ngOnInit() {
    const token = await this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userId = payload.userId;
      this.perfil = payload.perfil;
    } catch (err) {
      console.error('Error decodificando token:', err);
      await this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }

    // Ahora llamamos a loadMyTags con el userId en la ruta
    await this.loadMyTags(token);
    await this.loadTopUsersWithTags(token);

    this.loading = false;
  }

  private async loadMyTags(token: string) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Cambiamos la URL para usar el endpoint /tags/por-usuario/:userId
    this.http
      .get<any[]>(`${URL_Back}/tags/por-usuario/${this.userId}`, { headers })
      .subscribe({
        next: (res) => {
          this.myTags = res;  // El backend ya devuelve sólo los tags de este userId
        },
        error: (err) => {
          console.error('Error cargando mis tags:', err);
        }
      });
  }

  private async loadTopUsersWithTags(token: string) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<any[]>(`${URL_Back}/queries/top-users-with-tags`, { headers }).subscribe({
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

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
