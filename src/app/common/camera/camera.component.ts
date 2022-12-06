import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GeneralService } from '../../services/general.service';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { SweetMessagesService } from '../../services/sweet-messages.service';

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit {

  public photos: UserPhoto;
  private PHOTO_STORAGE: string = "photos";
  private platform: Platform;

  public _platformRun: string;

  @Input() needSaveLocal: boolean;
  @Input() needConfirmation: boolean;
  @Output() base64Img = new EventEmitter();

  public imgURL: string;

  constructor(
    public generalServ: GeneralService,
    platform: Platform,
    public sweetServ: SweetMessagesService
  ) {
    this.platform = platform;
  }

  ngOnInit() {
  }

  public async takePicture() {
    if (this.platform.is('capacitor')) {
      this._platformRun = 'capacitor';
      this.mobileCapture();
    } else {
      this._platformRun = 'web';
      this.webCapture();
    }
  }

  async webCapture() {
    const image = await Camera.getPhoto({
      quality: 50,
      width: 800,
      correctOrientation: true,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    if (this.needConfirmation && this.needConfirmation === true) {
      this.sweetServ.confirmRequest('¿Estás seguro de querer adjuntar este archivo?').then(async (_data) => {
        if (_data.value) {
          this.imgURL = image.webPath;
          const base64Data = await this.readAsBase64(image);

          if (base64Data) {
            this.base64Img.emit(base64Data);
          }
        }
      })
    } else {
      this.imgURL = image.webPath;
      const base64Data = await this.readAsBase64(image);

      if (base64Data) {
        this.base64Img.emit(base64Data);
      }
    }
  }

  public async mobileCapture() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 50,
      width: 800,
      correctOrientation: true
    }).then(async (data) =>  {
      if (this.needConfirmation && this.needConfirmation === true) {
        this.sweetServ.confirmRequest('¿Estás seguro de querer adjuntar este archivo?').then(async (_data) => {
          if (_data.value) {
            const savedImageFile = await this.savePictureToStorage(data);
            this.photos = savedImageFile;
          }
        })
      } else {
         const savedImageFile = await this.savePictureToStorage(data);
         this.photos = savedImageFile;
      }

    }).catch((e) => {
      console.log('photo error', e);
    });

    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
  }

  private async savePictureToStorage(cameraPhoto: Photo) {
    const base64Data = await this.readAsBase64(cameraPhoto);

    if (base64Data) {
      this.base64Img.emit(base64Data);
    }

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    if (this.platform.is('hybrid')) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath
      };
    }
  }

  private async readAsBase64(cameraPhoto: Photo) {
      if (this.platform.is('hybrid')) {
        const file = await Filesystem.readFile({
          path: cameraPhoto.path
        });

        return file.data;
      }
      else {
        const response = await fetch(cameraPhoto.webPath);
        const blob = await response.blob();

        return await this.convertBlobToBase64Mobile(blob) as string;
      }
  }

  convertBlobToBase64Mobile = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadSavedMobile() {
    // Retrieve cached photo array data
    const photoList = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];

    // Easiest way to detect when running on the web:
    // “when the platform is NOT hybrid, do this”
    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
      //for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
            path: this.photos.filepath,
            directory: Directory.Data
        });

        // Web platform only: Load the photo as base64 data
        this.photos.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      //}
    }
  }

}
