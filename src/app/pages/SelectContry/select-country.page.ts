import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { URL_Back } from 'src/app/config/url.servicios';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-select-country',
  templateUrl: './select-country.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule], // <--- IMPORTANTE
})
export class SelectCountryPage implements OnInit {
  countries: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.loadCountries();
  }

  loadCountries() {
    this.http.get(`${URL_Back}/countries`).subscribe({
      next: (res: any) => (this.countries = res),
      error: (err) => console.error('Error cargando países', err),
    });
  }

  async selectCountry(country: any) {
    await this.storage.set('paisSeleccionado', country);
    this.router.navigate(['/tabs/tab1']); // o el tab inicial que uses
  }
}
