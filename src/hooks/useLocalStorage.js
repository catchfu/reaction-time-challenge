import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage
 */
export const useLocalStorage = (key, initialValue) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Hook for managing game sessions in localStorage
 */
export const useGameSessions = (maxSessions = 100) => {
  const [sessions, setSessions] = useLocalStorage('rtc_game_sessions_v1', []);

  const addSession = (session) => {
    setSessions((prevSessions) => {
      const newSessions = [session, ...prevSessions];
      // Limit stored sessions
      if (newSessions.length > maxSessions) {
        return newSessions.slice(0, maxSessions);
      }
      return newSessions;
    });
  };

  const clearSessions = () => {
    setSessions([]);
  };

  return { sessions, addSession, clearSessions };
};

/**
 * Hook for managing user profile in localStorage
 */
export const useUserProfile = () => {
  const [profile, setProfile] = useLocalStorage('rtc_user_profile_v1', {
    userId: null,
    totalGamesPlayed: 0,
    bestReactionTime: null,
    averageReactionTime: null,
    createdAt: new Date().toISOString(),
    preferences: {
      soundEnabled: true,
      hapticsEnabled: true,
      defaultMode: 'standard'
    }
  });

  const updateProfile = (updates) => {
    setProfile((prev) => ({
      ...prev,
      ...updates
    }));
  };

  return { profile, updateProfile };
};
