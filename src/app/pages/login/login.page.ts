import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  imports: [ 
    FormsModule,
    IonicModule,
  ]
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  async login() {
    const loading = await this.loadingCtrl.create({ message: 'Iniciando sesión...' });
    await loading.present();

    this.authService.login(this.email, this.password).subscribe({
      next: async (res) => {
        await this.authService.saveToken(res.token);
        await loading.dismiss();
        this.router.navigate(['/select-country']);
      },
      error: async (err) => {
        await loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: err.error.message || 'Credenciales inválidas',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
