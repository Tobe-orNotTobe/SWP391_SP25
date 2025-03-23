import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
    VITE_FireBase_API_KEY, VITE_FireBase_App_Id,
    VITE_FireBase_Auth_Domain, VITE_FireBase_Measurement_Id, VITE_FireBase_Messaging_Sender_Id,
    VITE_FireBase_Project_Id,
    VITE_FireBase_Storage_Bucket
} from "../config/firebaseConfig.ts";


const firebaseConfig = {
    apiKey: VITE_FireBase_API_KEY,
    authDomain: VITE_FireBase_Auth_Domain,
    projectId: VITE_FireBase_Project_Id,
    storageBucket: VITE_FireBase_Storage_Bucket,
    messagingSenderId: VITE_FireBase_Messaging_Sender_Id,
    appId: VITE_FireBase_App_Id,
    measurementId: VITE_FireBase_Measurement_Id
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };

