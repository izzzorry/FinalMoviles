import { Component } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
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

  perfil: string = ''; // <- para el HTML *ngIf="perfil === 'Admin'"
  ciudadForm: any = { nombre: '', imageUrl: '' }; // <- para el formulario
  enEdicion: boolean = false;
  ciudadSeleccionada: any = null;

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
        this.perfil = payload.perfil; // <-- usado en el HTML
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

  cargarFormulario(ciudad: any) {
    this.enEdicion = true;
    this.ciudadSeleccionada = ciudad;
    this.ciudadForm = { ...ciudad }; // copia para edición
  }

  crearCiudad() {
    this.enEdicion = false;
    this.ciudadSeleccionada = null;
    this.ciudadForm = { nombre: '', imageUrl: '' };
  }

  guardarCiudad() {
    if (!this.ciudadForm.nombre) return;

    const payload = {
      nombre: this.ciudadForm.nombre,
      imageUrl: this.ciudadForm.imageUrl,
      pais_id: this.idPais
    };

    if (this.enEdicion && this.ciudadSeleccionada && this.ciudadSeleccionada._id) {
      this.ciudadService.actualizarCiudad(this.ciudadSeleccionada._id, payload).subscribe(() => {
        this.resetFormulario();
        this.obtenerCiudades();
      });
    } else {
      this.ciudadService.crearCiudad(payload).subscribe(() => {
        this.resetFormulario();
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

  resetFormulario() {
    this.enEdicion = false;
    this.ciudadSeleccionada = null;
    this.ciudadForm = { nombre: '', imageUrl: '' };
  }
}
