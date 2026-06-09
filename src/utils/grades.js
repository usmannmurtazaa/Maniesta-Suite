// Re-export everything from the canonical grades constants
export {
  GRADES,
  SCALES,
  getGradeScale,
  getStanding,
  STANDING_COLORS,
} from '../constants/grades';

// Import GRADES locally to build the gradePoints lookup
import { GRADES as _GRADES } from '../constants/grades';

// Quick lookup table for grade letter → points
export const gradePoints = Object.freeze(
  Object.fromEntries(_GRADES.map(g => [g.g, g.p]))
);