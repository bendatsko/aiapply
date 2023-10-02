// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase'; // Import your firebase auth object
import { doc, getDoc } from 'firebase/firestore'; // import getDoc and doc from Firestore
import { db } from './firebase'; // Import your Firestore instance

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if(authUser) {
        // If a user is logged in, fetch their data from Firestore
        const userDocRef = doc(db, 'users', authUser.uid);
        const userDoc = await getDoc(userDocRef);
        if(userDoc.exists()) {
          // Merge auth user object with Firestore user data
          setUser({ ...authUser, ...userDoc.data() });
        } else {
          // If there's no user data in Firestore, just use the auth user object
          setUser(authUser);
        }
      } else {
        // If no user is logged in, set user to null
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
      <UserContext.Provider value={user}>
        {children}
      </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

export default UserContext;
