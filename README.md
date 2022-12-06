# GRIP'S App Usuario

#### Desarrollado con:
* Ionic 6.3.4
* Capacitor 4
* Angular 14.2.6
* Angular Material 14.2.6

### Dependencias de servicios externos cuenta: craneapps21@gmail.com
* Firebase para notificaciones push
* Google Cloud
    * Directions API
    * Maps Javascript API
    
### Para ejecutar en local
ionic serve --external

### Para ejecutar con live refresh linkeado a android
ionic capacitor run android -l --external

### Para realizar una compilación a prod
* Android: ionic capacitor build android --prod --release
* IOS: ionic capacitor build ios --prod --release
