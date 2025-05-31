import { Component } from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PaisService } from 'src/app/services/pais.service';
import { CiudadService } from 'src/app/services/ciudad.service';
import { HeaderTabsComponent } from '../componentes/header-tabs/header-tabs.component';
import { Storage } from '@ionic/storage-angular';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HeaderTabsComponent
  ]
})
export class Tab1Page {
  idPais: string = '';
  nombrePais: string = '';
  ciudades: any[] = [];
  esAdmin: boolean = false;

  ciudadSeleccionada: any = { nombre: '', imageUrl: '' };
  enEdicion: boolean = false;

  constructor(
    private paisService: PaisService,
    private ciudadService: CiudadService,
    private storage: Storage,
    private alertCtrl: AlertController
  ) {
    this.cargarPaisYCiudades();
    this.verificarRol();
  }

  async verificarRol() {
    const token = await this.storage.get('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.esAdmin = payload.perfil === 'Admin';
      } catch (err) {
        console.error('Error al verificar rol:', err);
      }
    }
  }

  async cargarPaisYCiudades() {
    const pais = await this.paisService.getPais();
    if (pais && pais._id) {
      this.idPais = pais._id;
      this.nombrePais = pais.nombre;

      this.obtenerCiudades();
    }
  }

  obtenerCiudades() {
    this.ciudadService.getCiudadesPorPais(this.idPais).subscribe({
      next: (data) => {
        this.ciudades = data;
      },
      error: (err) => {
        console.error('Error al cargar ciudades:', err);
      }
    });
  }

  crearCiudad() {
    this.enEdicion = false;
    this.ciudadSeleccionada = { nombre: '', imageUrl: '' };
  }

  editarCiudad(ciudad: any) {
    this.enEdicion = true;
    this.ciudadSeleccionada = { ...ciudad };
  }

  guardarCiudad() {
    if (!this.ciudadSeleccionada.nombre) return;

    const payload = {
      nombre: this.ciudadSeleccionada.nombre,
      imageUrl: this.ciudadSeleccionada.imageUrl,
      pais_id: this.idPais
    };

    if (this.enEdicion && this.ciudadSeleccionada._id) {
      this.ciudadService.actualizarCiudad(this.ciudadSeleccionada._id, payload).subscribe(() => {
        this.ciudadSeleccionada = { nombre: '', imageUrl: '' };
        this.enEdicion = false;
        this.obtenerCiudades();
      });
    } else {
      this.ciudadService.crearCiudad(payload).subscribe(() => {
        this.ciudadSeleccionada = { nombre: '', imageUrl: '' };
        this.enEdicion = false;
        this.obtenerCiudades();
      });
    }
  }

  async eliminarCiudad(id: string) {
    const alerta = await this.alertCtrl.create({
      header: '¿Eliminar ciudad?',
      message: 'Esta acción no se puede deshacer',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => {
            this.ciudadService.eliminarCiudad(id).subscribe(() => {
              this.obtenerCiudades();
            });
          }
        }
      ]
    });

    await alerta.present();
  }
}
