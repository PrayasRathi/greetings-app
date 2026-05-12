import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
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
          const parsedGuest = JSON.parse(guest);
          setUser(parsedGuest);
          
          // Check if guest needs profile setup
          const profileDone = localStorage.getItem('greetings_profile_guest');
          if (!profileDone) {
            setNeedsProfileSetup(true);
          }
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

  const signUpWithEmail = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      let message = "An error occurred during sign up.";
      if (error.code === 'auth/email-already-in-use') {
        message = "An account with this email already exists.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Please enter a valid email address.";
      } else if (error.code === 'auth/operation-not-allowed') {
        message = "Email/Password login is not enabled in Firebase Console.";
        console.warn("CRITICAL: Email/Password provider is disabled in Firebase Console.");
      }
      return { success: false, error: message };
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      let message = "An error occurred during login.";
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/user-not-found') {
        message = "No account found with this email. Please sign up.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Please enter a valid email address.";
      } else if (error.code === 'auth/operation-not-allowed') {
        message = "Email/Password login is not enabled in Firebase Console.";
        console.warn("CRITICAL: Email/Password provider is disabled in Firebase Console.");
      }
      return { success: false, error: message };
    }
  };

  const loginAsGuest = () => {
    const guestUser = {
      uid: 'guest', // Fixed UID for guests
      displayName: 'Guest User',
      photoURL: null, // No dicebear
      isGuest: true
    };
    localStorage.setItem('guest_user', JSON.stringify(guestUser));
    setUser(guestUser);
    
    // Trigger profile setup for first-time guests
    const profileDone = localStorage.getItem('greetings_profile_guest');
    if (!profileDone) {
      setNeedsProfileSetup(true);
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('guest_user');
    setUser(null);
    setNeedsProfileSetup(false);
  };

  const updateProfile = async (data) => {
    if (user?.isGuest) {
      const updatedGuest = { ...user, ...data };
      localStorage.setItem('guest_user', JSON.stringify(updatedGuest));
      localStorage.setItem('greetings_profile_guest', 'true');
      setUser(updatedGuest);
      setNeedsProfileSetup(false);
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
    signUpWithEmail,
    signInWithEmail,
    loginAsGuest,
    logout,
    updateProfile
  };
};
