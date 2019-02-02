import firebase from 'firebase';
import 'firebase/firestore';

// initialize Firebase
var config = {
    apiKey: "AIzaSyARlkRck4tzzxp7Omo8kd6MXWgBIouxYEA",
    authDomain: "smartcards-d6a0d.firebaseapp.com",
    databaseURL: "https://smartcards-d6a0d.firebaseio.com",
    projectId: "smartcards-d6a0d",
    storageBucket: "smartcards-d6a0d.appspot.com",
    messagingSenderId: "211245242528"
};

export default class Firebase {
    static db;

    static init() {
        // init app for database
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        // init firebase databae
        Firebase.db = firebase.firestore();
        const settings = { timestampsInSnapshots: true };
        Firebase.db.settings(settings);

        // init firebase file storage
        Firebase.storage = firebase.storage();
    }
}