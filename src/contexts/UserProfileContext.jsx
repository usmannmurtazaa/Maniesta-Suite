import React, { createContext, useContext, useMemo } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';

const UserProfileContext = createContext(null);

export function UserProfileProvider({ children }) {
  const { profile, actions, loading } = useUserProfile();
  // Memoize the context value to prevent unnecessary re‑renders of consumers
  const value = useMemo(() => ({ profile, actions, loading }), [profile, actions, loading]);
  return (
    <UserProfileContext.Provider value={value}>
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