import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { PaisService } from 'src/app/services/pais.service';
import { HeaderTabsComponent } from '../componentes/header-tabs/header-tabs.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { URL_Back } from 'src/app/config/url.servicios';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
    imports: [
  IonicModule,
  CommonModule,
  HeaderTabsComponent
]
 
})
export class Tab3Page {
  idPais: string = '';
  nombrePais: string = '';
  sitios: any[] = [];
  favoritos: string[] = []


  constructor(private paisService: PaisService,
    private http: HttpClient,
    private toastController: ToastController)
   {
   addIcons({ heart, heartOutline });
  }

  async ngOnInit() {
    const pais = await this.paisService.getPais();
    if (pais?._id) {
      this.idPais = pais._id;
       this.cargarFavoritos();
      this.cargarSitios(this.idPais);
    }
  }

  cargarSitios(idPais: string) {
    this.http.get(`${URL_Back}/sites/por-pais/${idPais}`).subscribe({
      next: (res: any) => this.sitios = res,
      error: (err) => console.error('Error cargando sitios', err)
    });
  }
  cargarFavoritos() {
    const favs = localStorage.getItem('sitiosFavoritos');
    this.favoritos = favs ? JSON.parse(favs) : [];
  }

   guardarFavoritos() {
    localStorage.setItem('sitiosFavoritos', JSON.stringify(this.favoritos));
  }
  async toggleFavorito(id: string) {
    const index = this.favoritos.indexOf(id);
    if (index > -1) {
      this.favoritos.splice(index, 1);
      await this.presentToast('Sitio eliminado de favoritos');
    } else {
      this.favoritos.push(id);
      await this.presentToast('Sitio agregado a favoritos');
    }
    this.guardarFavoritos();
  }

  esFavorito(id: string): boolean {
    return this.favoritos.includes(id);
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1000,
      position: 'top'
    });
    toast.present();
  }


}
