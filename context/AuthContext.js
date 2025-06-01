// context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // Store registered users

  const signup = (email, password) => {
    if (email && password) {
      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return { success: false, message: 'User already exists' };
      }
      
      // Add new user to users array
      const newUser = { email, password };
      setUsers(prev => [...prev, newUser]);
      setUser({ email });
      return { success: true, message: 'Account created successfully' };
    }
    return { success: false, message: 'Please fill in all fields' };
  };

  const signin = (email, password) => {
    if (email && password) {
      // Check if user exists and password matches
      const existingUser = users.find(u => u.email === email && u.password === password);
      if (existingUser) {
        setUser({ email });
        return { success: true, message: 'Signed in successfully' };
      }
      return { success: false, message: 'Invalid email or password' };
    }
    return { success: false, message: 'Please fill in all fields' };
  };

  const signout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}