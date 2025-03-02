"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase/clientApp";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { getOrCreateDbUser } from "../lib/db/auth";
import { firebaseConfig } from "../lib/firebase/config";

const AuthContext = createContext();

export function AuthProvider({ children, initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [idToken, setIdToken] = useState(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const serializedFirebaseConfig = encodeURIComponent(
        JSON.stringify(firebaseConfig)
      );
      const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`;

      navigator.serviceWorker
        .register(serviceWorkerUrl)
        .then((registration) => console.log("scope is: ", registration.scope));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setIdToken(token);

        try {
          const dbUser = await getOrCreateDbUser(
            firebaseUser.uid,
            firebaseUser.email
          );
          if (!user || user.id !== dbUser.id) {
            setUser(dbUser);
          }
        } catch (error) {
          console.error("Error fetching db user:", error);
        }
      } else {
        setUser(null);
        setIdToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true); // Indicate loading state
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      const { uid, email } = result.user;
      const dbUser = await getOrCreateDbUser(uid, email);

      setIdToken(token);
      setUser(dbUser);
      setLoading(false);

      return dbUser; // Return the database user for caller use
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setLoading(false); // Reset loading on error
      throw error; // Propagate error to caller
    }
  }

  async function signOut() {
    try {
      setLoading(true); // Indicate loading state
      await auth.signOut(); // Sign out from Firebase first
      setUser(null);
      setIdToken(null);
      setLoading(false);
    } catch (error) {
      console.error("Error signing out:", error);
      setLoading(false); // Reset loading on error
      throw error; // Propagate error to caller
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        idToken,
        loading,
        signOut,
        signInWithGoogle,
        recaptchaVerifier,
        setRecaptchaVerifier,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
}
