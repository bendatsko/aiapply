// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './firebase'; // Import your firebase auth object

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
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
