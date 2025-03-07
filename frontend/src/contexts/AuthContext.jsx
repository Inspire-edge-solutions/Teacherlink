import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

// Define a more complete context type
const AuthContext = createContext({
  user: null,
  loading: true,
  setUser: (user) => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          console.log("Firebase UID:", firebaseUser.uid);
          
          const response = await axios({
            method: 'get',
            url: `https://0vg0fr4nqc.execute-api.ap-south-1.amazonaws.com/staging/users/${firebaseUser.uid}`,
            params: {
              route: 'GetUser'
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log("Firebase UID:", firebaseUser.uid);
          console.log("API Response:", response.data);

          // Create a merged user object with the correct user_type
          const mergedUser = {
            ...firebaseUser,
            user_type: response.data.user_type || response.data.role, // Try both fields
            // Include any other fields from the API response
            ...response.data
          };

          console.log("Merged User:", mergedUser); // Debug log
          setUser(mergedUser);
          
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Don't set the user until we have the type information
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Create a value object with all the context values
  const value = {
    user,
    loading,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 