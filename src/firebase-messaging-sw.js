importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyBvXNPC8ojkOwJbomdjh8hZneTnkls7_XM",
  authDomain: "craneapps2021.firebaseapp.com",
  projectId: "craneapps2021",
  storageBucket: "craneapps2021.appspot.com",
  messagingSenderId: "507324171961",
  appId: "1:507324171961:web:c6d26f20e2ed9dd9303d68",
  measurementId: "G-CX2F5X1J3Q"
}
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
