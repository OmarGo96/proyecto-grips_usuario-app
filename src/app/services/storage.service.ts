import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async set(key: string, value: any) {
    await Preferences.set({key, value});
  }
   // Return key
  async get(key: string) {
    return await Preferences.get({key});
  }

  async delete(key: string) {
    await Preferences.remove({key});
  }

  async clear() {
    await Preferences.clear();
  }
}
