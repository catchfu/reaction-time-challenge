import { format, parseISO, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

/**
 * Get leaderboard for a specific time period
 */
export const getLeaderboard = (sessions, timeRange = 'all', mode = 'all') => {
  let filteredSessions = [...sessions];

  // Filter by time range
  const now = new Date();
  if (timeRange === 'daily') {
    const today = startOfDay(now);
    const tomorrow = endOfDay(now);
    filteredSessions = filteredSessions.filter(session => {
      const sessionDate = parseISO(session.timestamp);
      return isWithinInterval(sessionDate, { start: today, end: tomorrow });
    });
  } else if (timeRange === 'weekly') {
    const weekStart = subDays(now, 7);
    filteredSessions = filteredSessions.filter(session => {
      const sessionDate = parseISO(session.timestamp);
      return sessionDate >= weekStart;
    });
  } else if (timeRange === 'monthly') {
    const monthStart = subDays(now, 30);
    filteredSessions = filteredSessions.filter(session => {
      const sessionDate = parseISO(session.timestamp);
      return sessionDate >= monthStart;
    });
  }

  // Filter by mode
  if (mode !== 'all') {
    filteredSessions = filteredSessions.filter(session => session.mode === mode);
  }

  // Group by user (using a random user ID for localStorage demo)
  // In a real app, this would be actual user IDs
  const userId = 'local_user_' + getLocalUserId();
  const userSessions = filteredSessions.filter(s => true); // All sessions for demo

  if (userSessions.length === 0) {
    return {
      entries: [],
      userRank: null,
      totalPlayers: 0
    };
  }

  // Calculate best scores for this user
  const modeSpecificScores = {};
  userSessions.forEach(session => {
    if (!modeSpecificScores[session.mode] || session.stats.best < modeSpecificScores[session.mode].best) {
      modeSpecificScores[session.mode] = {
        mode: session.mode,
        best: session.stats.best,
        average: session.stats.average,
        gamesPlayed: 1
      };
    } else {
      modeSpecificScores[session.mode].gamesPlayed++;
    }
  });

  // Generate leaderboard entries (simulate other players for demo)
  const entries = [];

  // Add user's scores
  Object.values(modeSpecificScores).forEach(score => {
    if (score.best > 0) {
      entries.push({
        userId,
        username: 'You',
        avatar: '👤',
        bestTime: score.best,
        averageTime: score.average,
        gamesPlayed: score.gamesPlayed,
        mode: score.mode,
        isCurrentUser: true
      });
    }
  });

  // Simulate other players for demo purposes
  const simulatedPlayers = generateSimulatedPlayers(timeRange, mode);
  entries.push(...simulatedPlayers);

  // Sort by best time
  entries.sort((a, b) => a.bestTime - b.bestTime);

  // Add ranks
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  // Find current user rank
  const userRank = entries.find(e => e.isCurrentUser)?.rank || null;

  return {
    entries: entries.slice(0, 50), // Top 50
    userRank,
    totalPlayers: entries.length
  };
};

/**
 * Generate simulated players for demo purposes
 */
const generateSimulatedPlayers = (timeRange, mode) => {
  const playerNames = [
    { name: 'Lightning', avatar: '⚡' },
    { name: 'FastFinger', avatar: '👉' },
    { name: 'ReflexKing', avatar: '👑' },
    { name: 'QuickClicker', avatar: '🖱️' },
    { name: 'SpeedDemon', avatar: '😈' },
    { name: 'ReactionMaster', avatar: '🎯' },
    { name: 'Flash', avatar: '⚡' },
    { name: 'Bullet', avatar: '💨' },
    { name: 'Rocket', avatar: '🚀' },
    { name: 'Turbo', avatar: '🏎️' },
    { name: 'LightningStrike', avatar: '🌩️' },
    { name: 'HyperSpeed', avatar: '💫' },
    { name: 'RapidFire', avatar: '🔥' },
    { name: 'Instinct', avatar: '🧠' },
    { name: 'Ninja', avatar: '🥷' }
  ];

  const players = [];
  const numPlayers = timeRange === 'daily' ? 10 : timeRange === 'weekly' ? 20 : 30;

  for (let i = 0; i < numPlayers; i++) {
    const player = playerNames[i % playerNames.length];
    const bestTime = generateRealisticTime(mode);
    const avgTime = bestTime + Math.random() * 50 + 20;

    players.push({
      userId: `ai_player_${i}`,
      username: player.name,
      avatar: player.avatar,
      bestTime: Math.round(bestTime),
      averageTime: Math.round(avgTime),
      gamesPlayed: Math.floor(Math.random() * 20) + 5,
      mode: mode === 'all' ? 'standard' : mode,
      isCurrentUser: false
    });
  }

  return players;
};

/**
 * Generate a realistic reaction time based on mode
 */
const generateRealisticTime = (mode) => {
  const baseTimes = {
    beginner: { min: 250, max: 400 },
    standard: { min: 200, max: 350 },
    advanced: { min: 180, max: 300 },
    expert: { min: 150, max: 250 },
    all: { min: 180, max: 350 }
  };

  const config = baseTimes[mode] || baseTimes.all;
  return config.min + Math.random() * (config.max - config.min);
};

/**
 * Get user's rank on leaderboard
 */
export const getUserRank = (sessions, mode = 'all') => {
  const leaderboard = getLeaderboard(sessions, 'all', mode);
  return leaderboard.userRank;
};

/**
 * Check if user's score qualifies for leaderboard
 */
export const qualifiesForLeaderboard = (stats) => {
  return stats.validRounds >= 3 && stats.average > 0;
};

/**
 * Get rank badge
 */
export const getRankBadge = (rank) => {
  if (rank === 1) return { emoji: '🥇', color: '#FFD700', name: 'Gold' };
  if (rank === 2) return { emoji: '🥈', color: '#C0C0C0', name: 'Silver' };
  if (rank === 3) return { emoji: '🥉', color: '#CD7F32', name: 'Bronze' };
  if (rank <= 10) return { emoji: '🌟', color: '#4CAF50', name: 'Top 10' };
  if (rank <= 25) return { emoji: '⭐', color: '#2196F3', name: 'Top 25' };
  return { emoji: '', color: '#9E9E9E', name: '' };
};

/**
 * Get local user ID from localStorage (generate if doesn't exist)
 */
const getLocalUserId = () => {
  let userId = localStorage.getItem('rtc_user_id');
  if (!userId) {
    userId = Math.random().toString(36).substring(7);
    localStorage.setItem('rtc_user_id', userId);
  }
  return userId;
};

/**
 * Save leaderboard entry
 */
export const saveLeaderboardEntry = (session, username) => {
  const leaderboardData = {
    userId: getLocalUserId(),
    username: username || 'Anonymous',
    timestamp: session.timestamp,
    stats: session.stats,
    mode: session.mode
  };

  const leaderboard = JSON.parse(localStorage.getItem('rtc_leaderboard') || '[]');
  leaderboard.push(leaderboardData);

  // Keep only last 100 entries
  if (leaderboard.length > 100) {
    leaderboard.splice(0, leaderboard.length - 100);
  }

  localStorage.setItem('rtc_leaderboard', JSON.stringify(leaderboard));
};

/**
 * Get leaderboard entries from localStorage
 */
export const getStoredLeaderboard = () => {
  return JSON.parse(localStorage.getItem('rtc_leaderboard') || '[]');
};
