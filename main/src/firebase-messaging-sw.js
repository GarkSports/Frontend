importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");
firebase.initializeApp ({
    apiKey: "AIzaSyBkmIsiUvOtWc2LqOJERDqlb2SNQlV_378",
    authDomain: "garknotif.firebaseapp.com",
    projectId: "garknotif",
    storageBucket: "garknotif.appspot.com",
    messagingSenderId: "618893557837",
    appId: "1:618893557837:web:cad81f9ed51cb8d0e25c04",
    measurementId: "G-N6CCEHZCG2"
});
const messaging = firebase.messaging();