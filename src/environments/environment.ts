// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //API_URL: 'http://localhost:8016/api',
  //API_PARTNER: 'http://localhost:8016/api/partners', // url del backend

  API_URL: 'https://app.econogruas.com/econogruas-backend/api', // url del backend
  API_PARTNER: 'https://app.econogruas.com/econogruas-backend/api/partners', // url del backend
  app_name: 'Grip´s Gruas',
  firebase: {
    apiKey: "AIzaSyBvXNPC8ojkOwJbomdjh8hZneTnkls7_XM",
    authDomain: "craneapps2021.firebaseapp.com",
    projectId: "craneapps2021",
    storageBucket: "craneapps2021.appspot.com",
    messagingSenderId: "507324171961",
    appId: "1:507324171961:web:c6d26f20e2ed9dd9303d68",
    measurementId: "G-CX2F5X1J3Q"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
