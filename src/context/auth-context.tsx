
"use client";

import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import type { UserProfile, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  role: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // This is a more robust way to handle the async nature of getting claims and profiles.
        // We ensure all data is fetched before setting loading to false.
        const fetchUserData = async () => {
          try {
            // Force refresh the token to get the latest claims. This is crucial.
            const tokenResult = await getIdTokenResult(firebaseUser, true);
            const claims = tokenResult.claims;
            const userRole: UserRole = claims.superadmin ? 'superadmin' : claims.admin ? 'admin' : 'client';
            setRole(userRole);

            // Now that we have the role, get the profile
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const unsubProfile = onSnapshot(userDocRef, 
              (doc) => {
                if (doc.exists()) {
                  setUserProfile({ ...doc.data(), uid: doc.id } as UserProfile);
                } else {
                  console.error("User profile document does not exist.");
                  setUserProfile(null);
                }
                // Only set loading to false after all user data is fetched.
                setLoading(false);
              }, 
              (error) => {
                 console.error("Error fetching user profile:", error);
                 setUser(null);
                 setUserProfile(null);
                 setRole(null);
                 setLoading(false);
              }
            );
            return () => unsubProfile();

          } catch (error) {
             console.error("Error fetching user data (claims or profile):", error);
             setUser(null);
             setUserProfile(null);
             setRole(null);
             setLoading(false);
          }
        };

        fetchUserData();
        
      } else {
        // No user is signed in.
        setUser(null);
        setUserProfile(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = { user, userProfile, role, loading };

  // Render children only when loading is false. 
  // For the initial load, the MainLayout will show a loading screen.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
