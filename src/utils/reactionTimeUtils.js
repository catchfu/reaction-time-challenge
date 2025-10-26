/**
 * Get high-resolution timestamp using performance.now()
 * Falls back to Date.now() if performance API is not available
 */
export const getTimestamp = () => {
  if (typeof performance !== 'undefined' && performance.now) {
    return performance.now();
  }
  return Date.now();
};

/**
 * Generate random delay between min and max (in milliseconds)
 */
export const generateRandomDelay = (min = 1500, max = 5000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Calculate reaction time from stimulus and response timestamps
 */
export const calculateReactionTime = (stimulusTime, responseTime) => {
  return responseTime - stimulusTime;
};

/**
 * Check if a click is a false start (before stimulus)
 */
export const isFalseStart = (clickTime, stimulusTime) => {
  return clickTime < stimulusTime;
};

/**
 * Get performance tier based on reaction time
 */
export const getPerformanceTier = (time) => {
  if (time < 150) return { name: 'Lightning', color: '#FFD700', description: 'Lightning fast!' };
  if (time < 250) return { name: 'Excellent', color: '#4CAF50', description: 'Excellent reflexes!' };
  if (time < 350) return { name: 'Good', color: '#8BC34A', description: 'Good job!' };
  if (time < 450) return { name: 'Average', color: '#FFC107', description: 'Not bad!' };
  if (time < 600) return { name: 'Slow', color: '#FF9800', description: 'Keep practicing!' };
  return { name: 'Needs Improvement', color: '#FF5252', description: 'Try again!' };
};

/**
 * Check if reaction time is suspicious (too fast or too consistent)
 */
export const isSuspiciousReactionTime = (time) => {
  return time < 100; // Less than 100ms is likely not humanly possible
};
