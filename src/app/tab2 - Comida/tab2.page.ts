import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { IonicModule } from '@ionic/angular';
import { PaisService } from 'src/app/services/pais.service';
import { HeaderTabsComponent } from '../componentes/header-tabs/header-tabs.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonicModule,HeaderTabsComponent ]
})
export class Tab2Page {

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
