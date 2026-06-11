// src/contexts/UserProfileContext.jsx
import React, { createContext, useContext } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';

const UserProfileContext = createContext(null);

export function UserProfileProvider({ children }) {
  const { profile, actions, loading } = useUserProfile();
  return (
    <UserProfileContext.Provider value={{ profile, actions, loading }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfileContext() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfileContext must be used within a UserProfileProvider');
  }
  return context;
}