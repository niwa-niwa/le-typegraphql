import { FirebaseApp, initializeApp } from "firebase/app";
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  UserCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { restV1Client } from "./axios";

const firebaseConfig: object = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APP_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_APP_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_APP_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_APP_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_APP_MEASUREMENTID,
};

const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

export const client_auth: Auth = getAuth(firebaseApp);

export async function signupWithGoogle() {
  const result: UserCredential = await signInWithPopup(
    client_auth,
    new GoogleAuthProvider()
  );

  const token: string = await result.user.getIdToken();

  const me = await restV1Client.get("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return me;
}

export type SignupValue = {
  email: string;
  password: string;
};

export async function signupWithEmail({ email, password }: SignupValue) {
  const result: UserCredential = await createUserWithEmailAndPassword(
    client_auth,
    email,
    password
  );

  const token: string = await result.user.getIdToken();

  const me = await restV1Client.get("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return me;
}

export async function signinWithEmail({ email, password }: SignupValue) {
  const result: UserCredential = await signInWithEmailAndPassword(
    client_auth,
    email,
    password
  );

  const token: string = await result.user.getIdToken();

  const me = await restV1Client.get("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return me;
}
