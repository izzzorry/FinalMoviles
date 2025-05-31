import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient,  HttpHeaders} from '@angular/common/http';
import {
  IonicModule,
  ToastController,
  LoadingController,
  AlertController,   // IMPORTANTE: AlertController
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonThumbnail
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PaisService } from 'src/app/services/pais.service';
import { URL_Back } from 'src/app/config/url.servicios';
import { HeaderTabsComponent } from '../componentes/header-tabs/header-tabs.component';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

import { camera } from 'ionicons/icons';
import { addIcons } from 'ionicons';

addIcons({ camera });

@Component({
  selector: 'app-tab4',
  standalone: true,
  imports: [
  CommonModule,
  IonicModule,
  HeaderTabsComponent
],

  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  famosos: any[] = [];
  sitiosPais: any[] = [];
  idPais = '';

  private lastPhotoBlob: Blob | null = null;
  private lastPhotoFileName: string = '';
  private takenFamousId: string | null = null;

  constructor(
    private http: HttpClient,
     private authService: AuthService,
    private paisService: PaisService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController   // <--- AlertController inyectado aquí
  ) {}

  async ngOnInit() {
    const pais = await this.paisService.getPais();
    if (pais?._id) {
      this.idPais = pais._id;
      this.cargarFamosos(pais._id);
      this.cargarSitios(pais._id);
    }
  }

  cargarFamosos(paisId: string) {
    this.http.get(`${URL_Back}/famousPeople/por-pais/${paisId}`).subscribe({
      next: (res: any) => (this.famosos = res),
      error: (err) => console.error('Error cargando famosos', err),
    });
  }

  cargarSitios(paisId: string) {
    this.http.get(`${URL_Back}/sites/por-pais/${paisId}`).subscribe({
      next: (res: any) => (this.sitiosPais = res),
      error: (err) => console.error('Error cargando sitios', err),
    });
  }

  async tomarFoto(famoso: any) {
    this.takenFamousId = famoso._id;

    const loadingCam = await this.loadingCtrl.create({
      message: 'Abriendo cámara...',
    });
    await loadingCam.present();

    try {
      const photo: Photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      await loadingCam.dismiss();

      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      this.lastPhotoBlob = blob;
      this.lastPhotoFileName = `photo-${Date.now()}.jpg`;

      // AQUI es donde definimos "inputs" antes de llamar a create()
      const inputs: Array<{
        name: string;
        type: 'radio';
        label: string;
        value: string;
      }> = this.sitiosPais.map((sitio) => ({
        name: `sitio-${sitio._id}`,
        type: 'radio',
        label: sitio.nombre,
        value: sitio._id
      }));

      // Luego llamamos a showSiteSelector pasándole ese arreglo
      await this.showSiteSelector(inputs);
    } catch (camErr) {
      await loadingCam.dismiss();
      console.error('Error al tomar foto:', camErr);
      const toast = await this.toastCtrl.create({
        message: 'No se pudo tomar la foto',
        duration: 1500,
        position: 'top',
      });
      toast.present();
    }
  }

  private async showSiteSelector(
    inputs: Array<{ name: string; type: 'radio'; label: string; value: string; }>
  ) {
    if (!this.lastPhotoBlob || !this.takenFamousId) {
      return;
    }

    // ¡OJO! Aquí usamos "inputs: inputs" SIN ERROR
    const alert = await this.alertCtrl.create({
      header: '¿En qué sitio fue tomada la foto?',
      inputs: inputs,   // <-- Aquí no debe marcar error si "inputs" está bien tipado
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.lastPhotoBlob = null;
            this.takenFamousId = null;
          }
        },
        {
          text: 'Confirmar',
          handler: (selectedSiteId: string) => {
            this.uploadTagWithPhoto(selectedSiteId);
          }
        }
      ]
    });

    await alert.present();
  }

  private async uploadTagWithPhoto(siteId: string) {
    if (!this.lastPhotoBlob || !this.takenFamousId) {
      return;
    }

    const uploading = await this.loadingCtrl.create({
      message: 'Guardando etiqueta con foto...',
    });
    await uploading.present();

    // 1) Obtener token desde el AuthService
    let token: string | null;
    try {
      token = await this.authService.getToken();
    } catch (err) {
      // Si falla al leer el storage
      await uploading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'No se pudo leer el token. Por favor, inicia sesión de nuevo.',
        duration: 1500,
        position: 'top',
      });
      await toast.present();
      return;
    }

    if (!token) {
      // Si no hay token almacenado
      await uploading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Debes iniciar sesión para subir una foto.',
        duration: 1500,
        position: 'top',
      });
      await toast.present();
      return;
    }

    // 2) Construir FormData
    const formData = new FormData();
    formData.append('famousPersonId', this.takenFamousId);
    formData.append('siteId', siteId);
    formData.append('photo', this.lastPhotoBlob, this.lastPhotoFileName);

    // 3) Construir headers con Authorization
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    // 4) Hacer POST a /tags con FormData y headers
    this.http
      .post(`${URL_Back}/tags`, formData, { headers })
      .subscribe({
        next: async () => {
          // Éxito: limpiamos y mostramos un toast
          await uploading.dismiss();
          this.lastPhotoBlob = null;
          this.takenFamousId = null;
          const toast = await this.toastCtrl.create({
            message: 'Etiqueta guardada correctamente.',
            duration: 1500,
            position: 'top',
          });
          await toast.present();
        },
        error: async (err) => {
          // Error en el upload
          await uploading.dismiss();
          console.error('Error al guardar etiqueta:', err);
          const toast = await this.toastCtrl.create({
            message: 'Error al guardar la etiqueta con foto.',
            duration: 1500,
            position: 'top',
          });
          await toast.present();
        }
      });
  }


}
