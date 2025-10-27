/**
 * Achievement definitions for the Reaction Time Challenge
 */

export const ACHIEVEMENTS = [
  // Speed achievements
  {
    id: 'first_game',
    name: 'Getting Started',
    description: 'Complete your first game',
    icon: '🎯',
    category: 'dedication',
    rarity: 'common',
    points: 10,
    condition: {
      type: 'games_played',
      threshold: 1
    }
  },
  {
    id: 'sub_300',
    name: 'Quick Reflexes',
    description: 'Achieve an average under 300ms',
    icon: '⚡',
    category: 'speed',
    rarity: 'common',
    points: 20,
    condition: {
      type: 'average_time',
      threshold: 300
    }
  },
  {
    id: 'sub_250',
    name: 'Lightning Fast',
    description: 'Achieve an average under 250ms',
    icon: '🌩️',
    category: 'speed',
    rarity: 'uncommon',
    points: 35,
    condition: {
      type: 'average_time',
      threshold: 250
    }
  },
  {
    id: 'sub_200',
    name: 'Superhuman',
    description: 'Achieve an average under 200ms',
    icon: '👽',
    category: 'speed',
    rarity: 'rare',
    points: 50,
    condition: {
      type: 'average_time',
      threshold: 200
    }
  },
  {
    id: 'sub_150',
    name: 'Impossible',
    description: 'Achieve an average under 150ms',
    icon: '🤖',
    category: 'speed',
    rarity: 'legendary',
    points: 100,
    condition: {
      type: 'average_time',
      threshold: 150
    }
  },

  // Best Time achievements
  {
    id: 'pb_350',
    name: 'Personal Best',
    description: 'Get a personal best under 350ms',
    icon: '🏆',
    category: 'speed',
    rarity: 'common',
    points: 15,
    condition: {
      type: 'best_time',
      threshold: 350
    }
  },
  {
    id: 'pb_250',
    name: 'Speed Demon',
    description: 'Get a personal best under 250ms',
    icon: '🦅',
    category: 'speed',
    rarity: 'uncommon',
    points: 30,
    condition: {
      type: 'best_time',
      threshold: 250
    }
  },
  {
    id: 'pb_200',
    name: 'Speed King',
    description: 'Get a personal best under 200ms',
    icon: '👑',
    category: 'speed',
    rarity: 'epic',
    points: 60,
    condition: {
      type: 'best_time',
      threshold: 200
    }
  },

  // Volume achievements
  {
    id: 'games_10',
    name: 'Dedicated',
    description: 'Play 10 games',
    icon: '💪',
    category: 'dedication',
    rarity: 'common',
    points: 15,
    condition: {
      type: 'games_played',
      threshold: 10
    }
  },
  {
    id: 'games_50',
    name: 'Enthusiast',
    description: 'Play 50 games',
    icon: '🎮',
    category: 'dedication',
    rarity: 'uncommon',
    points: 30,
    condition: {
      type: 'games_played',
      threshold: 50
    }
  },
  {
    id: 'games_100',
    name: 'Addicted',
    description: 'Play 100 games',
    icon: '🔥',
    category: 'dedication',
    rarity: 'rare',
    points: 50,
    condition: {
      type: 'games_played',
      threshold: 100
    }
  },
  {
    id: 'games_500',
    name: 'Legend',
    description: 'Play 500 games',
    icon: '🌟',
    category: 'dedication',
    rarity: 'legendary',
    points: 200,
    condition: {
      type: 'games_played',
      threshold: 500
    }
  },

  // Consistency achievements
  {
    id: 'consistent_5',
    name: 'Steady Hands',
    description: 'Achieve consistency score over 70%',
    icon: '🎯',
    category: 'consistency',
    rarity: 'uncommon',
    points: 25,
    condition: {
      type: 'consistency',
      threshold: 70
    }
  },
  {
    id: 'consistent_8',
    name: 'Precision Machine',
    description: 'Achieve consistency score over 85%',
    icon: '🤖',
    category: 'consistency',
    rarity: 'epic',
    points: 60,
    condition: {
      type: 'consistency',
      threshold: 85
    }
  },

  // Streak achievements
  {
    id: 'streak_3',
    name: 'On Fire',
    description: 'Get 3 games in a row under 300ms',
    icon: '🔥',
    category: 'special',
    rarity: 'uncommon',
    points: 30,
    condition: {
      type: 'streak',
      threshold: 3
    }
  },
  {
    id: 'streak_5',
    name: 'Unstoppable',
    description: 'Get 5 games in a row under 300ms',
    icon: '⚡',
    category: 'special',
    rarity: 'epic',
    points: 75,
    condition: {
      type: 'streak',
      threshold: 5
    }
  },
  {
    id: 'streak_10',
    name: 'God Mode',
    description: 'Get 10 games in a row under 300ms',
    icon: '👑',
    category: 'special',
    rarity: 'legendary',
    points: 150,
    condition: {
      type: 'streak',
      threshold: 10
    }
  },

  // Special achievements
  {
    id: 'no_false_starts_10',
    name: 'Patience',
    description: 'Complete 10 games without false starts',
    icon: '🧘',
    category: 'special',
    rarity: 'rare',
    points: 40,
    condition: {
      type: 'no_false_starts',
      threshold: 10
    }
  },
  {
    id: 'no_false_starts_50',
    name: 'Zen Master',
    description: 'Complete 50 games without false starts',
    icon: '🧘‍♂️',
    category: 'special',
    rarity: 'epic',
    points: 100,
    condition: {
      type: 'no_false_starts',
      threshold: 50
    }
  },
  {
    id: 'perfect_session',
    name: 'Flawless Victory',
    description: 'All 5 rounds under 250ms in one session',
    icon: '💎',
    category: 'special',
    rarity: 'epic',
    points: 80,
    condition: {
      type: 'perfect_session',
      threshold: 250
    }
  },
  {
    id: 'all_modes',
    name: 'Versatile Player',
    description: 'Play all 4 difficulty modes',
    icon: '🌈',
    category: 'dedication',
    rarity: 'uncommon',
    points: 40,
    condition: {
      type: 'modes_played',
      threshold: 4
    }
  },
  {
    id: 'comeback',
    name: 'Never Give Up',
    description: 'Improve by 50ms over 5 games',
    icon: '📈',
    category: 'improvement',
    rarity: 'uncommon',
    points: 35,
    condition: {
      type: 'improvement',
      threshold: 50
    }
  },
  {
    id: 'morning_player',
    name: 'Early Bird',
    description: 'Play 10 games before 10am',
    icon: '🌅',
    category: 'special',
    rarity: 'rare',
    points: 45,
    condition: {
      type: 'time_of_day',
      threshold: 10,
      hour: true
    }
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Play 10 games after 10pm',
    icon: '🌙',
    category: 'special',
    rarity: 'rare',
    points: 45,
    condition: {
      type: 'time_of_day',
      threshold: 22,
      hour: true
    }
  }
];

export const ACHIEVEMENT_CATEGORIES = {
  speed: 'Speed',
  consistency: 'Consistency',
  dedication: 'Dedication',
  special: 'Special',
  improvement: 'Improvement'
};

export const ACHIEVEMENT_RARITY = {
  common: { name: 'Common', color: '#9E9E9E', bgColor: 'rgba(158, 158, 158, 0.2)' },
  uncommon: { name: 'Uncommon', color: '#4CAF50', bgColor: 'rgba(76, 175, 80, 0.2)' },
  rare: { name: 'Rare', color: '#2196F3', bgColor: 'rgba(33, 150, 243, 0.2)' },
  epic: { name: 'Epic', color: '#9C27B0', bgColor: 'rgba(156, 39, 176, 0.2)' },
  legendary: { name: 'Legendary', color: '#FFD700', bgColor: 'rgba(255, 215, 0, 0.2)' }
};

export const LEVELS = [
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
