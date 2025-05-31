import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PaisService } from 'src/app/services/pais.service';
import { CiudadService } from 'src/app/services/ciudad.service';
import { HeaderTabsComponent } from '../componentes/header-tabs/header-tabs.component';

@Component({
  standalone: true,
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  imports: [
    IonicModule,
    CommonModule,
    HeaderTabsComponent
  ]
})
export class Tab1Page {
  idPais: string = '';
  nombrePais: string = '';
  ciudades: any[] = [];

  constructor(
    private paisService: PaisService,
    private ciudadService: CiudadService
  ) {
    this.cargarPaisYCiudades();
  }

  
  async cargarPaisYCiudades() {
    const pais = await this.paisService.getPais();
    if (pais && pais._id) {
      this.idPais = pais._id;
      this.nombrePais = pais.nombre;

      this.ciudadService.getCiudadesPorPais(this.idPais).subscribe({
        next: (data) => {
          this.ciudades = data;
        },
        error: (err) => {
          console.error('Error al cargar ciudades:', err);
        }
      });
    }
  }

  
}
