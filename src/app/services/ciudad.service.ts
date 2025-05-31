import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_Back } from '../config/url.servicios';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class CiudadService {
  private baseUrl = `${URL_Back}/cities`;

  constructor(private http: HttpClient, private storage: Storage) {}

  // ✅ Obtener ciudades por país
  getCiudadesPorPais(pais_id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/por-pais/${pais_id}`);
  }

  // ✅ Crear ciudad (con token)
  crearCiudad(payload: any): Observable<any> {
    return from(this.storage.get('token')).pipe(
      switchMap(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post<any>(`${this.baseUrl}`, payload, { headers });
      })
    );
  }

  // ✅ Actualizar ciudad (con token)
  actualizarCiudad(ciudadId: string, payload: any): Observable<any> {
    return from(this.storage.get('token')).pipe(
      switchMap(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.put<any>(`${this.baseUrl}/${ciudadId}`, payload, { headers });
      })
    );
  }

  // ✅ Eliminar ciudad (con token)
  eliminarCiudad(ciudadId: string): Observable<any> {
    return from(this.storage.get('token')).pipe(
      switchMap(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.delete<any>(`${this.baseUrl}/${ciudadId}`, { headers });
      })
    );
  }
}
