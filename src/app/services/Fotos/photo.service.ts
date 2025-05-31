import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo
} from '@capacitor/camera';
import {
  Filesystem,
  Directory
} from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() {}

  public async takePhoto(): Promise<string> {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 90,
    });

    const savedPhoto = await this.savePicture(photo);
    return savedPhoto; // Esto será una ruta válida tipo 'data:image/jpeg;base64,...'
  }

  private async savePicture(photo: Photo): Promise<string> {
    const base64Data = await this.readAsBase64(photo);

    const fileName = new Date().getTime() + '.jpeg';
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    // Leerlo nuevamente como base64 para mostrar en <img>
    const readResult = await Filesystem.readFile({
      path: fileName,
      directory: Directory.Data,
    });

    return `data:image/jpeg;base64,${readResult.data}`;
  }

  private async readAsBase64(photo: Photo): Promise<string> {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
