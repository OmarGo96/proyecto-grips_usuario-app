import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
import {fromEvent} from 'rxjs';
import {take} from 'rxjs/operators';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

  // Call the element loader after the platform has been bootstrapped
defineCustomElements(window);

fromEvent(document, 'deviceready')
  .pipe(take(1))
  .subscribe(() => {
    const isAndroid = /Android/.test(window.navigator.userAgent);
    if (isAndroid) {
      fixIonAppViewPort();
    }
  });

function fixIonAppViewPort() {
  const hack = () => {
    const ionApp = document.querySelector('ion-app');
    if (ionApp) {
      window.requestAnimationFrame(() => {
        ionApp.style.height = '100%';
        window.requestAnimationFrame(() => {
          ionApp.style.height = '';
        });
      });
      let validFocusElements = ['textarea', 'input'];
      let focusElement = document.querySelector(':focus');
      if (focusElement && validFocusElements.includes(focusElement.tagName.toLowerCase())) {
        setTimeout(() => {
          focusElement?.scrollIntoView({behavior: 'smooth', block: 'center'});
        }, 300);
      }
    }
  };
  if ('ResizeObserver' in window) {
    const ResizeObserver = (window as any).ResizeObserver;
    new ResizeObserver(hack).observe(document.documentElement);
  } else {
    window.addEventListener('keyboardWillShow', hack);
    window.addEventListener('keyboardWillHide', hack);
  }
}
