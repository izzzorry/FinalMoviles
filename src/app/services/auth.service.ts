import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { URL_Back } from '../config/url.servicios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';

  constructor(private http: HttpClient, private storage: Storage) {
    this.storage.create(); // inicializa el storage al arrancar
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${URL_Back}/auth/login`, { email, password });
  }

  register(data: { email: string; password: string; nombre: string; perfil: string }): Observable<any> {
    return this.http.post(`${URL_Back}/auth/register`, data);
  }

  async saveToken(token: string): Promise<void> {
    await this.storage.set(this.tokenKey, token);
  }

  async getToken(): Promise<string | null> {
    return await this.storage.get(this.tokenKey);
  }

  async logout(): Promise<void> {
    await this.storage.remove(this.tokenKey);
  }
}
