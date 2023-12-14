import admin from "firebase-admin";
import path from "path";

const firebaseServiceAccountPath = path.join(
  __dirname,
  "../../happiness-overload-firebase-adminsdk-c7rx1-0e8a0275b5.json"
);
const firebaseServiceAccount = require(firebaseServiceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
  databaseURL: "https://happiness-overload-default-rtdb.asia-southeast1.firebasedatabase.app/",
  storageBucket: "happiness-overload.appspot.com",
});

export const bucket = admin.storage().bucket();

export default admin;
