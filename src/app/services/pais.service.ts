import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  private readonly key = 'paisSeleccionado';

  constructor(private storage: Storage) {
    this.storage.create();
  }

  async setPais(pais: any): Promise<void> {
    await this.storage.set(this.key, pais);
  }

  async getPais(): Promise<any> {
    return await this.storage.get(this.key);
  }

  async clearPais(): Promise<void> {
    await this.storage.remove(this.key);
  }
}
