import { ACHIEVEMENTS } from '../data/achievements';
import { format, parseISO, getHours } from 'date-fns';

/**
 * Check which achievements have been unlocked
 */
export const checkAchievements = (sessions, profile, stats) => {
  const unlockedAchievements = [];
  const newAchievements = [];

  sessions.forEach(session => {
    const sessionDate = parseISO(session.timestamp);
    const hour = getHours(sessionDate);

    // Calculate session streak
    const streak = calculateStreak(sessions);

    // Check each achievement
    ACHIEVEMENTS.forEach(achievement => {
      if (profile.achievements?.some(a => a.id === achievement.id)) {
        return; // Already unlocked
      }

      const unlocked = checkSingleAchievement(
        achievement,
        sessions,
        profile,
        stats,
        hour
      );

      if (unlocked) {
        const achievementData = {
          ...achievement,
          unlockedAt: new Date().toISOString()
        };
        unlockedAchievements.push(achievementData);
        newAchievements.push(achievementData);
      }
    });
  });

  return { unlockedAchievements, newAchievements };
};

/**
 * Check a single achievement
 */
const checkSingleAchievement = (achievement, sessions, profile, stats, sessionHour) => {
  const condition = achievement.condition;

  switch (condition.type) {
    case 'games_played':
      return (profile.totalGamesPlayed || 0) >= condition.threshold;

    case 'average_time':
      if (stats.average === 0) return false;
      return stats.average <= condition.threshold;

    case 'best_time':
      const bestTime = profile.bestReactionTime;
      return bestTime && bestTime <= condition.threshold;

    case 'consistency':
      return stats.consistencyScore >= condition.threshold;

    case 'streak':
      const streak = calculateStreak(sessions);
      return streak >= condition.threshold;

    case 'no_false_starts':
      // Count consecutive games without false starts
      let consecutiveGames = 0;
      for (let i = 0; i < sessions.length; i++) {
        if (sessions[i].stats.falseStarts === 0) {
          consecutiveGames++;
          if (consecutiveGames >= condition.threshold) {
            return true;
          }
        } else {
          break;
        }
      }
      return false;

    case 'perfect_session':
      return stats.validRounds === stats.totalRounds && stats.average <= condition.threshold;

    case 'modes_played':
      const uniqueModes = new Set(sessions.map(s => s.mode));
      return uniqueModes.size >= condition.threshold;

    case 'improvement':
      if (sessions.length < 10) return false;
      const recent5 = sessions.slice(0, 5);
      const previous5 = sessions.slice(5, 10);

      const recentAvg = recent5.reduce((sum, s) => sum + s.stats.average, 0) / 5;
      const previousAvg = previous5.reduce((sum, s) => sum + s.stats.average, 0) / 5;

      return (previousAvg - recentAvg) >= condition.threshold;

    case 'time_of_day':
      const gamesAtHour = sessions.filter(s => getHours(parseISO(s.timestamp)) >= condition.threshold).length;
      return gamesAtHour >= condition.threshold;

    default:
      return false;
  }
};

/**
 * Calculate current streak (consecutive games under 300ms)
 */
export const calculateStreak = (sessions) => {
  let streak = 0;
  for (let i = 0; i < sessions.length; i++) {
    if (sessions[i].stats.average > 0 && sessions[i].stats.average <= 300) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

/**
 * Get achievement rarity info
 */
export const getAchievementRarity = (rarity) => {
  const rarityMap = {
    common: { name: 'Common', color: '#9E9E9E', bgColor: 'rgba(158, 158, 158, 0.2)' },
    uncommon: { name: 'Uncommon', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.2)' },
    rare: { name: 'Rare', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.2)' },
    epic: { name: 'Epic', color: '#9C27B0', bgColor: 'rgba(156, 39, 176, 0.2)' },
    legendary: { name: 'Legendary', color: '#FFD700', bgColor: 'rgba(255, 215, 0, 0.2)' }
  };
  return rarityMap[rarity] || rarityMap.common;
};

/**
 * Calculate XP earned from a session
 */
export const calculateXPFromSession = (stats, isPersonalBest) => {
  let xp = 0;

  // Base XP from playing
  xp += 10;

  // XP from performance
  if (stats.average > 0) {
    if (stats.average < 200) xp += 40;
    else if (stats.average < 250) xp += 30;
    else if (stats.average < 300) xp += 20;
    else if (stats.average < 400) xp += 10;
  }

  // XP from consistency
  if (stats.consistencyScore > 80) xp += 15;
  else if (stats.consistencyScore > 60) xp += 10;

  // Bonus for personal best
  if (isPersonalBest) xp += 25;

  // Bonus for no false starts
  if (stats.falseStarts === 0) xp += 10;

  return xp;
};

/**
 * Calculate XP earned from achievements
 */
export const calculateXPFomAchievement = (achievement) => {
  return achievement.points || 0;
};

/**
 * Get current level from XP
 */
export const getCurrentLevel = (xp) => {
  const levels = [
    { level: 1, name: 'Rookie', xpRequired: 0 },
    { level: 2, name: 'Novice', xpRequired: 100 },
    { level: 3, name: 'Apprentice', xpRequired: 250 },
    { level: 4, name: 'Adept', xpRequired: 450 },
    { level: 5, name: 'Skilled', xpRequired: 700 },
    { level: 6, name: 'Expert', xpRequired: 1000 },
    { level: 7, name: 'Veteran', xpRequired: 1350 },
    { level: 8, name: 'Master', xpRequired: 1750 },
    { level: 9, name: 'Grandmaster', xpRequired: 2200 },
    { level: 10, name: 'Legend', xpRequired: 2700 },
    { level: 11, name: 'Mythic', xpRequired: 3250 },
    { level: 12, name: 'Transcendent', xpRequired: 3850 },
    { level: 13, name: 'Celestial', xpRequired: 4500 },
    { level: 14, name: 'Divine', xpRequired: 5200 },
    { level: 15, name: 'God Tier', xpRequired: 6000 }
  ];

  let currentLevel = levels[0];
  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].xpRequired) {
      currentLevel = levels[i];
    } else {
      break;
    }
  }

  const nextLevel = levels.find(l => l.level === currentLevel.level + 1);
  const xpForCurrentLevel = currentLevel.xpRequired;
  const xpForNextLevel = nextLevel ? nextLevel.xpRequired : xp;
  const xpProgress = nextLevel ? ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100 : 100;

  return {
    ...currentLevel,
    xp,
    nextLevel: nextLevel ? nextLevel : null,
    xpProgress: Math.min(100, Math.max(0, xpProgress)),
    xpToNext: nextLevel ? nextLevel.xpRequired - xp : 0
  };
};

/**
 * Get achievement progress percentage
 */
export const getAchievementProgress = (achievement, sessions, profile, stats) => {
  const condition = achievement.condition;

  switch (condition.type) {
    case 'games_played':
      return Math.min(100, ((profile.totalGamesPlayed || 0) / condition.threshold) * 100);

    case 'average_time':
      if (stats.average === 0) return 0;
      return Math.max(0, ((500 - stats.average) / (500 - condition.threshold)) * 100);

    case 'best_time':
      const bestTime = profile.bestReactionTime || 500;
      return Math.max(0, ((500 - bestTime) / (500 - condition.threshold)) * 100);

    case 'consistency':
      return Math.min(100, (stats.consistencyScore / condition.threshold) * 100);

    case 'streak':
      const streak = calculateStreak(sessions);
      return Math.min(100, (streak / condition.threshold) * 100);

    case 'no_false_starts':
      let consecutiveGames = 0;
      for (let i = 0; i < sessions.length; i++) {
        if (sessions[i].stats.falseStarts === 0) {
          consecutiveGames++;
        } else {
          break;
        }
      }
      return Math.min(100, (consecutiveGames / condition.threshold) * 100);

    case 'perfect_session':
      if (stats.validRounds === stats.totalRounds && stats.average > 0) {
        return Math.max(0, ((500 - stats.average) / (500 - condition.threshold)) * 100);
      }
      return 0;

    case 'modes_played':
      const uniqueModes = new Set(sessions.map(s => s.mode));
      return Math.min(100, (uniqueModes.size / condition.threshold) * 100);

    default:
      return 0;
  }
};

/**
 * Filter achievements by category
 */
export const filterAchievementsByCategory = (achievements, category) => {
  if (category === 'all') return achievements;
  return achievements.filter(a => a.category === category);
};

/**
 * Get recent achievements (last 10)
 */
export const getRecentAchievements = (achievements) => {
  return [...achievements]
    .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
    .slice(0, 10);
};
