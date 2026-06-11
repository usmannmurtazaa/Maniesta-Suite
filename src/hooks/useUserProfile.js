// src/hooks/useUserProfile.js
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getUserProfile,
  updateUserProfile,
  trackToolUsage,
  incrementVisitCount,
  trackExport,
  updateLastVisit,
  setDraftCourses,
  clearAllData,
  initializeUserProfile,
} from '../services/userProfileService';

/**
 * React hook that provides reactive access to the user profile.
 * It subscribes to localStorage changes (via storage event) and
 * re‑renders when the profile is updated from any tab.
 * @returns {Object} { profile, actions, loading }
 */
export function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const isInitialized = useRef(false);

  const refreshProfile = useCallback(() => {
    try {
      const current = getUserProfile();
      setProfile(current);
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (!isInitialized.current) {
      initializeUserProfile();
      refreshProfile();
      isInitialized.current = true;
    }
  }, [refreshProfile]);

  // Listen to localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key?.endsWith('user_profile')) {
        refreshProfile();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshProfile]);

  // Expose actions as stable references
  const actions = useRef({
    trackToolUsage,
    incrementVisitCount,
    trackExport,
    updateLastVisit,
    setDraftCourses,
    clearAllData,
    updateProfile: (updater) => {
      const newProfile = updateUserProfile(updater);
      setProfile(newProfile);
    },
    refresh: refreshProfile,
  }).current;

  return { profile, actions, loading };
}