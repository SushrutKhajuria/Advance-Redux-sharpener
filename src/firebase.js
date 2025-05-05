// src/firebase.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyBpdMdRALBmH5OxHuShDjBbVoJRqOSpgFU",
    authDomain: "advance-redux-cart-ea9e2.firebaseapp.com",
    databaseURL: "https://advance-redux-cart-ea9e2-default-rtdb.firebaseio.com",
    projectId: "advance-redux-cart-ea9e2",
    storageBucket: "advance-redux-cart-ea9e2.firebasestorage.app",
    messagingSenderId: "840198806764",
    appId: "1:840198806764:web:21c026ed9dc4427fdb19c9"
  };

const app = initializeApp(firebaseConfig);
export default app;