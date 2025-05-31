// src/app/pages/menu-sitio/menu-sitio.page.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_Back } from 'src/app/config/url.servicios';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-sitio',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './menu-sitio.page.html',
})
export class MenuSitioPage implements OnInit {
  platoId: string = '';
  menus: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Extracción exacta del parámetro “plato_id” de la URL
    this.platoId = this.route.snapshot.paramMap.get('plato_id') || '';
    this.cargarMenuPorPlato();
  }

  cargarMenuPorPlato() {
    // IMPORTANTE: usar “menu_sitios” (guión bajo), tal y como lo monta tu backend:
    this.http
      .get<any[]>(`${URL_Back}/menu_sitios/por-plato/${this.platoId}`)
      .subscribe({
        next: (res) => {
          this.menus = res;
        },
        error: (err) => {
          console.error('Error cargando menú', err);
        }
      });
  }
}
