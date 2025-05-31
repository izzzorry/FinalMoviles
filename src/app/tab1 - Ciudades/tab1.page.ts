import { PaisService } from 'src/app/services/pais.service';
import { HeaderTabsComponent } from '../componentes/header-tabs/header-tabs.component';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

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

  constructor(private paisService: PaisService) {
    this.cargarPaisSeleccionado();
  }
  async cargarPaisSeleccionado() {
    const pais = await this.paisService.getPais();
    if (pais) {
      this.idPais = pais._id;
      this.nombrePais = pais.nombre;
    }
  }
}
