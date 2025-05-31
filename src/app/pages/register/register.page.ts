import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: true,
  imports: [
    IonicModule,
    FormsModule
  ],
})
export class RegisterPage {
  email = '';
  password = '';
  nombre = '';
  perfil = 'Comun'; // valor por defecto

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  async register() {
    const loading = await this.loadingCtrl.create({ message: 'Registrando usuario...' });
    await loading.present();

    const payload = {
      email: this.email,
      password: this.password,
      nombre: this.nombre,
      perfil: this.perfil
    };

    this.authService.register(payload).subscribe({
      next: async (res) => {
        // 1) Guardar el token, igual que en el login
        await this.authService.saveToken(res.token);

        // 2) Cerrar el loading
        await loading.dismiss();

        // 3) Redirigir directamente a /select-country
        this.router.navigate(['/select-country']);
      },
      error: async (err) => {
        await loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: err.error?.message || 'No se pudo registrar',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }
}
