import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (!userDoc.exists()) {
          setNeedsProfileSetup(true);
        }
        
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          ...userDoc.data()
        });
      } else {
        // Check for guest user in local storage
        const guest = localStorage.getItem('guest_user');
        if (guest) {
          setUser(JSON.parse(guest));
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const loginAsGuest = () => {
    const guestUser = {
      uid: 'guest-' + Math.random().toString(36).substr(2, 9),
      displayName: 'Guest User',
      photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
      isGuest: true
    };
    localStorage.setItem('guest_user', JSON.stringify(guestUser));
    setUser(guestUser);
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('guest_user');
    setUser(null);
  };

  const updateProfile = async (data) => {
    if (user?.isGuest) {
      const updatedGuest = { ...user, ...data };
      localStorage.setItem('guest_user', JSON.stringify(updatedGuest));
      setUser(updatedGuest);
      return;
    }

    if (user) {
      await setDoc(doc(db, 'users', user.uid), data, { merge: true });
      setUser(prev => ({ ...prev, ...data }));
      setNeedsProfileSetup(false);
    }
  };

  return {
    user,
    loading,
    needsProfileSetup,
    loginWithGoogle,
    loginAsGuest,
    logout,
    updateProfile
  };
};
