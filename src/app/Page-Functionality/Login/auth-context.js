"use client"

import { createContext, useState } from "react"

import {auth} from '../../index'
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { useAuthState } from 'react-firebase-hooks/auth';


export const authContext = createContext({
  user: null,
  encryptionPassword: '', updateEncryptionPassword: () => {},   // TODO: wipe from memory when tab is closed
  loading: false,
  googleLoginHandler: async () => {},
  facebookLoginHandler: async () => {},
  logout: async () => {},
});

export default function AuthContextProvider({ children }) {
  const [user, loading] = useAuthState(auth);
  const [encryptionPassword, setEncryptionPassword] = useState('');

  const googleProvider = new GoogleAuthProvider(auth);

  const googleLoginHandler = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      throw error;
    }
  };

  const facebookProvider = new FacebookAuthProvider(auth);

  const facebookLoginHandler = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      throw error;
    }
  }  // FIXME

  const logout = () => {
    signOut(auth);
  };

  const values = {
    user,
    loading,
    encryptionPassword, setEncryptionPassword,
    googleLoginHandler,
    facebookLoginHandler,
    logout,
  };

  return <authContext.Provider value={values}>{children}</authContext.Provider>;
}