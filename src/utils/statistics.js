/**
 * Calculate average of an array of numbers
 */
export const calculateAverage = (times) => {
  if (!times || times.length === 0) return 0;
  return times.reduce((sum, time) => sum + time, 0) / times.length;
};

/**
 * Calculate standard deviation
 */
export const calculateStandardDeviation = (times) => {
  if (!times || times.length === 0) return 0;
  const avg = calculateAverage(times);
  const squaredDiffs = times.map(time => Math.pow(time - avg, 2));
  const variance = calculateAverage(squaredDiffs);
  return Math.sqrt(variance);
};

/**
 * Calculate median
 */
export const calculateMedian = (times) => {
  if (!times || times.length === 0) return 0;
  const sorted = [...times].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

/**
 * Calculate best (minimum) time
 */
export const calculateBest = (times) => {
  if (!times || times.length === 0) return 0;
  return Math.min(...times);
};

/**
 * Calculate worst (maximum) time
 */
export const calculateWorst = (times) => {
  if (!times || times.length === 0) return 0;
  return Math.max(...times);
};

/**
 * Calculate consistency score (0-100, higher is better)
 */
export const calculateConsistencyScore = (times) => {
  if (!times || times.length === 0) return 0;
  const avg = calculateAverage(times);
  const stdDev = calculateStandardDeviation(times);
  const coefficientOfVariation = (stdDev / avg) * 100;
  return Math.max(0, 100 - coefficientOfVariation);
};

/**
 * Check if a time is a personal best
 */
export const isPersonalBest = (time, previousBest) => {
  if (previousBest === null || previousBest === undefined) return true;
  return time < previousBest;
};

/**
 * Calculate session statistics
 */
export const calculateSessionStats = (rounds) => {
  const validRounds = rounds.filter(r => !r.falseStart);
  const times = validRounds.map(r => r.reactionTime);

  if (times.length === 0) {
    return {
      average: 0,
      best: 0,
      worst: 0,
      standardDeviation: 0,
      median: 0,
      consistencyScore: 0,
      totalRounds: rounds.length,
      validRounds: 0,
      falseStarts: rounds.length
    };
  }

  return {
    average: calculateAverage(times),
    best: calculateBest(times),
    worst: calculateWorst(times),
    standardDeviation: calculateStandardDeviation(times),
    median: calculateMedian(times),
    consistencyScore: calculateConsistencyScore(times),
    totalRounds: rounds.length,
    validRounds: validRounds.length,
    falseStarts: rounds.length - validRounds.length
  };
};
