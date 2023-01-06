import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: import.meta.env.apiKey,
    authDomain: import.meta.env.authDomain,
    databaseURL: "https://nbaplayersid-default-rtdb.firebaseio.com",
    projectId: import.meta.env.projectId,
    storageBucket: import.meta.env.storageBucket,
    messagingSenderId: import.meta.env.messagingSenderId,
    appId: import.meta.env.appId,
    measurementId: import.meta.measurementId
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);