// src/constants/profileSchema.js
export const CURRENT_SCHEMA_VERSION = 2;

export const DEFAULT_PROFILE = {
  _schemaVersion: CURRENT_SCHEMA_VERSION,
  firstVisit: null,
  visitCount: 0,
  lastVisit: null,
  lastToolUsed: null,
  toolUsage: {
    gpa: { count: 0, lastUsed: null },
    cgpa: { count: 0, lastUsed: null },
    currency: { count: 0, lastUsed: null },
    unit: { count: 0, lastUsed: null },
    interest: { count: 0, lastUsed: null },
    scientific: { count: 0, lastUsed: null },
    export: { count: 0, lastUsed: null },
  },
  exportCount: 0,
  hasCalculatedGpa: false,
  hasCalculatedCgpa: false,
  draftCourses: [],
};

/**
 * Migrate old profile structure to the latest schema version.
 * @param {any} oldProfile - Previously stored profile (may be incomplete or old version)
 * @returns {object} - Migrated profile conforming to DEFAULT_PROFILE shape
 */
export function migrateProfile(oldProfile) {
  if (!oldProfile || typeof oldProfile !== 'object') {
    return { ...DEFAULT_PROFILE, firstVisit: new Date().toISOString() };
  }

  // Start with a fresh default and overlay existing safe values
  const migrated = { ...DEFAULT_PROFILE };

  // Copy simple fields if they exist and are of correct type
  if (typeof oldProfile.firstVisit === 'string') migrated.firstVisit = oldProfile.firstVisit;
  if (typeof oldProfile.visitCount === 'number') migrated.visitCount = oldProfile.visitCount;
  if (typeof oldProfile.lastVisit === 'string') migrated.lastVisit = oldProfile.lastVisit;
  if (typeof oldProfile.lastToolUsed === 'string') migrated.lastToolUsed = oldProfile.lastToolUsed;
  if (typeof oldProfile.exportCount === 'number') migrated.exportCount = oldProfile.exportCount;
  if (typeof oldProfile.hasCalculatedGpa === 'boolean') migrated.hasCalculatedGpa = oldProfile.hasCalculatedGpa;
  if (typeof oldProfile.hasCalculatedCgpa === 'boolean') migrated.hasCalculatedCgpa = oldProfile.hasCalculatedCgpa;

  // Merge toolUsage (ensure each tool has both count and lastUsed)
  if (oldProfile.toolUsage && typeof oldProfile.toolUsage === 'object') {
    for (const tool of Object.keys(migrated.toolUsage)) {
      const oldTool = oldProfile.toolUsage[tool];
      if (oldTool && typeof oldTool === 'object') {
        if (typeof oldTool.count === 'number') migrated.toolUsage[tool].count = oldTool.count;
        if (typeof oldTool.lastUsed === 'string') migrated.toolUsage[tool].lastUsed = oldTool.lastUsed;
      }
    }
  }

  // Merge draftCourses (ensure array)
  if (Array.isArray(oldProfile.draftCourses)) {
    migrated.draftCourses = oldProfile.draftCourses.slice(0, 8); // limit to 8
  }

  // Set schema version
  migrated._schemaVersion = CURRENT_SCHEMA_VERSION;

  return migrated;
}