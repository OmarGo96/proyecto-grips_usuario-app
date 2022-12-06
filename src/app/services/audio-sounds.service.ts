import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

interface Sound {
  key: string;
  asset: string;
  isNative: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AudioSoundsService {

  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  private forceWebAudio: boolean = true;

  constructor(private platform: Platform, private nativeAudio: NativeAudio){

  }

  preload(key?: string, asset?: string): void {

    let _key = (key) ? key : 'econogruas-sound';
    let _asset = (asset) ? asset : 'assets/sounds/notification.mp3';

    if((this.platform.is('cordova') || this.platform.is('capacitor')) && !this.forceWebAudio) {

      this.nativeAudio.preloadSimple(_key, _asset);

      this.sounds.push({
        key: _key,
        asset: _asset,
        isNative: true
      });

    } else {

      let audio = new Audio();
      audio.src = _asset;

      this.sounds.push({
        key: _key,
        asset: _asset,
        isNative: false
      });

    }

  }

  play(key?: string): void {

    let _key = (key) ? key : 'econogruas-sound';

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === _key;
    });

    if(soundToPlay.isNative){

      this.nativeAudio.play(soundToPlay.asset).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });

    } else {

      this.audioPlayer.src = soundToPlay.asset;
      this.audioPlayer.play();

    }

  }
}
