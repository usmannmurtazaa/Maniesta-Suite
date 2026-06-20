export {
  GRADES,
  SCALES,
  getGradeScale,
  getStanding,
  STANDING_COLORS,
} from '../constants/grades';

// Import GRADES locally to build the gradePoints lookup
import { GRADES as _GRADES, getGradeScale as _getGradeScale } from '../constants/grades';

/**
 * DEPRECATED – Quick lookup table (grade letter → points) for the **default 4.0 scale only**.
 *
 * This table is locked to the 4.0 scale and will **not** work correctly
 * for 5.0 / 10.0 scales.  New code should either:
 *   - use the scale‑aware function `getGradePointsMap(scale)` below, or
 *   - extract points directly from the selected scale array (via `getGradeScale()`).
 */
export const gradePoints = Object.freeze(
  Object.fromEntries(_GRADES.map(g => [g.g, g.p]))
);

/**
 * Build a scale‑aware grade‑letter → points lookup table for any supported scale.
 *
 * @param {string} scale - scale key (e.g. '4.0', '5.0', '10.0')
 * @returns {Record<string, number>} frozen object mapping grade letters to points
 */
export function getGradePointsMap(scale = '4.0') {
  const gradeScale = _getGradeScale(scale);
  return Object.freeze(
    Object.fromEntries(gradeScale.map(g => [g.g, g.p]))
  );
}