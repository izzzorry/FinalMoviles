import { Component, OnInit } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { PaisService } from 'src/app/services/pais.service';
import { HeaderTabsComponent } from '../componentes/header-tabs/header-tabs.component';
import { HttpClient } from '@angular/common/http';
import { URL_Back } from 'src/app/config/url.servicios';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab2',
  standalone: true,
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
  IonicModule,
  CommonModule,
  HeaderTabsComponent
]
})
export class Tab2Page implements OnInit {
  idPais: string = '';
  nombrePais: string = '';
  comidas: any[] = [];

  constructor(
    private paisService: PaisService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    const pais = await this.paisService.getPais();
    if (pais?._id) {
      this.idPais = pais._id;
      this.nombrePais = pais.nombre;

      this.http.get(`${URL_Back}/dishes/por-pais/${this.idPais}`).subscribe({
        next: (res: any) => this.comidas = res,
        error: (err) => console.error('Error al cargar comidas', err),
      });
    }
  }
}
