import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {

    apiKey: "AIzaSyBiy4bGHIlQJNlfHyPOkyLAcbku-stoZ50",
    authDomain: "abc-e21be.firebaseapp.com",
    projectId: "abc-e21be",
    storageBucket: "abc-e21be.firebasestorage.app",
    messagingSenderId: "273803195481",
    appId: "1:273803195481:web:38784f19e7406778b5ed48",
    measurementId: "G-FS9ME9Y4KS"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };

