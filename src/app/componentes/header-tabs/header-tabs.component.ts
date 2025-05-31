import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

@Component({
  standalone: true,
  selector: 'app-header-tabs',
  templateUrl: './header-tabs.component.html',
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class HeaderTabsComponent implements OnInit {
  countryName: string = 'País';
  showUserButton: boolean = true;

  constructor(private router: Router, private storage: Storage) {
    addIcons({ personCircleOutline });
  }

  async ngOnInit() {
    const pais = await this.storage.get('paisSeleccionado');
    this.countryName = pais?.nombre || 'País';
  }

  goToCountrySelection() {
    this.router.navigate(['/select-country']);
  }

  openUserMenu() {
    this.router.navigate(['/profile']);
  }
}
