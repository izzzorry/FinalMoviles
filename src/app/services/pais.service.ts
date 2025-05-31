import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  private storageKey = 'paisSeleccionado';

  constructor(private storage: Storage) {}

  async setPais(pais: any): Promise<void> {
    await this.storage.set(this.storageKey, pais);
  }

  async getPais(): Promise<any> {
    return await this.storage.get(this.storageKey);
  }

  async clearPais(): Promise<void> {
    await this.storage.remove(this.storageKey);
  }
}
