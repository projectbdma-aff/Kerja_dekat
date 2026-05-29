const firebaseConfig = {

  apiKey: "API_KEY_KAMU",

  authDomain: "PROJECT.firebaseapp.com",

  projectId: "PROJECT_ID",

  storageBucket: "PROJECT.appspot.com",

  messagingSenderId: "123456789",

  appId: "APP_ID"

};

// INIT FIREBASE

firebase.initializeApp(firebaseConfig);

// AUTH

const auth = firebase.auth();

// DATABASE

const db = firebase.firestore();
