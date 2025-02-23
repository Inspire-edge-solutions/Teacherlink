import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch additional user data from your backend
          const response = await axios.get(
            `https://7eerqdly08.execute-api.ap-south-1.amazonaws.com/staging/users/${firebaseUser.uid}?route=GetUser`
          );
          
          setUser({
            ...firebaseUser,
            ...response.data // Merge Firebase user with backend user data
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(firebaseUser); // Fallback to just Firebase user data
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
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