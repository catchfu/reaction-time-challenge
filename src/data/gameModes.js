export const GAME_MODES_DATA = {
  beginner: {
    id: 'beginner',
    name: 'Beginner',
    description: '2-6 second delay, simple color change',
    difficulty: 1,
    color: '#4CAF50'
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    description: '1.5-5 second delay, color variations',
    difficulty: 2,
    color: '#2196F3'
  },
  advanced: {
    id: 'advanced',
    name: 'Advanced',
    description: '1-4 second delay, multiple stimuli',
    difficulty: 3,
    color: '#FF9800'
  },
  expert: {
    id: 'expert',
    name: 'Expert',
    description: '0.8-3 second delay, complex patterns',
    difficulty: 4,
    color: '#F44336'
  }
};

export const GAME_MODE_ORDER = ['beginner', 'standard', 'advanced', 'expert'];
