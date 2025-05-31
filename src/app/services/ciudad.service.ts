import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_Back } from '../config/url.servicios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {
  private baseUrl = `${URL_Back}/cities`;

  constructor(private http: HttpClient) {}

  getCiudadesPorPais(pais_id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/por-pais/${pais_id}`);
  }
}
