// src/services/userProfileService.js
import { safeGetItem, safeSetItem } from '../utils/localStorageWrapper';
import { DEFAULT_PROFILE, migrateProfile, CURRENT_SCHEMA_VERSION } from '../constants/profileSchema';

const PROFILE_KEY = 'user_profile';

/**
 * Read the current profile from localStorage, apply migration if needed,
 * and return the valid profile object.
 * @returns {object} The current user profile
 */
export function getUserProfile() {
  let raw = safeGetItem(PROFILE_KEY, null);
  if (!raw) {
    // First time visitor – create default profile
    const now = new Date().toISOString();
    const newProfile = {
      ...DEFAULT_PROFILE,
      firstVisit: now,
      lastVisit: now,
      visitCount: 1,
    };
    safeSetItem(PROFILE_KEY, newProfile);
    return newProfile;
  }

  // If schema version is missing or outdated, migrate
  if (!raw._schemaVersion || raw._schemaVersion < CURRENT_SCHEMA_VERSION) {
    const migrated = migrateProfile(raw);
    safeSetItem(PROFILE_KEY, migrated);
    return migrated;
  }

  return raw;
}

/**
 * Overwrite the entire profile (use with caution).
 * @param {object} profile - Complete profile object
 */
export function setUserProfile(profile) {
  safeSetItem(PROFILE_KEY, profile);
}

/**
 * Atomically update the profile using an updater function.
 * Reads current profile, applies updater, writes back.
 * @param {Function} updater - Function that receives current profile and mutates it (or returns new)
 * @returns {object} The updated profile
 */
export function updateUserProfile(updater) {
  const current = getUserProfile();
  const newProfile = updater(current) || current; // allow mutating or returning new
  setUserProfile(newProfile);
  return newProfile;
}

/**
 * Initialize the profile (ensure it exists and is up‑to‑date).
 * Usually called once at app startup.
 * @returns {object} The current profile
 */
export function initializeUserProfile() {
  return getUserProfile(); // same as getUserProfile
}

/**
 * Track usage of a specific tool.
 * @param {string} toolName - One of: 'gpa', 'cgpa', 'currency', 'unit', 'interest', 'scientific', 'export'
 */
export function trackToolUsage(toolName) {
  const now = new Date().toISOString();
  updateUserProfile((profile) => {
    if (!profile.toolUsage[toolName]) {
      profile.toolUsage[toolName] = { count: 0, lastUsed: null };
    }
    profile.toolUsage[toolName].count += 1;
    profile.toolUsage[toolName].lastUsed = now;
    profile.lastToolUsed = toolName;
    profile.lastVisit = now;

    // Update boolean flags for GPA/CGPA
    if (toolName === 'gpa') profile.hasCalculatedGpa = true;
    if (toolName === 'cgpa') profile.hasCalculatedCgpa = true;
    return profile;
  });
}

/**
 * Increment the total visit count and update lastVisit.
 */
export function incrementVisitCount() {
  const now = new Date().toISOString();
  updateUserProfile((profile) => {
    profile.visitCount = (profile.visitCount || 0) + 1;
    profile.lastVisit = now;
    return profile;
  });
}

/**
 * Increment the export counter.
 */
export function trackExport() {
  updateUserProfile((profile) => {
    profile.exportCount = (profile.exportCount || 0) + 1;
    if (profile.toolUsage.export) {
      profile.toolUsage.export.count += 1;
      profile.toolUsage.export.lastUsed = new Date().toISOString();
    }
    return profile;
  });
}

/**
 * Explicitly update lastVisit timestamp (e.g., on route change).
 */
export function updateLastVisit() {
  const now = new Date().toISOString();
  updateUserProfile((profile) => {
    profile.lastVisit = now;
    return profile;
  });
}

/**
 * Save draft courses (e.g., from GPA calculator).
 * @param {Array} courses - Array of course objects (max 8)
 */
export function setDraftCourses(courses) {
  updateUserProfile((profile) => {
    profile.draftCourses = (courses || []).slice(0, 8);
    return profile;
  });
}

/**
 * Clear all user data from localStorage.
 */
export function clearAllData() {
  const now = new Date().toISOString();
  const freshProfile = {
    ...DEFAULT_PROFILE,
    firstVisit: now,
    lastVisit: now,
    visitCount: 1,
  };
  setUserProfile(freshProfile);
}