import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { PaisService } from 'src/app/services/pais.service';
import { HeaderTabsComponent } from '../componentes/header-tabs/header-tabs.component';
import { CommonModule } from '@angular/common';
import { URL_Back } from 'src/app/config/url.servicios';
import { camera } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
   imports: [
  IonicModule,
  CommonModule,
  HeaderTabsComponent
],
})
export class Tab4Page {
  idPais: string = '';
  nombrePais: string = '';
  famosos: any[] = [];

  constructor(
    private http: HttpClient,
    private paisService: PaisService,
    private toastCtrl: ToastController
  ) {
    addIcons({ camera });
  }

  async ngOnInit() {
    const pais = await this.paisService.getPais();
    if (pais?._id) {
      this.idPais = pais._id;
      this.cargarFamosos(this.idPais);
    }
  }

  cargarFamosos(paisId: string) {
    this.http.get(`${URL_Back}/famousPeople/por-pais/${paisId}`).subscribe({
      next: (res: any) => (this.famosos = res),
      error: (err: any) => console.error('Error cargando famosos', err),
    });
  }

  async tomarFoto(famoso: any) {
    const toast = await this.toastCtrl.create({
      message: `Tomar foto con ${famoso.nombre}`,
      duration: 1500,
      position: 'top',
    });
    toast.present();}

}
