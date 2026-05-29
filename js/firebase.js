const firebaseConfig = {

  apiKey: "AIzaSyCxSbzpqLkjCF7LhxCsdg3xu530e0b_frs",

  authDomain: "kerjadekat-web.firebaseapp.com",

  projectId: "kerjadekat-web",

  storageBucket: "kerjadekat-web.firebasestorage.app",

  messagingSenderId: "99396133528",

  appId: "1:99396133528:web:7a01b8d1ffa588c50da6ed"

};

// INIT FIREBASE

firebase.initializeApp(firebaseConfig);

// AUTH

const auth = firebase.auth();

// DATABASE

const db = firebase.firestore();
