import { useState, useCallback, useRef } from 'react';
import {
  getTimestamp,
  generateRandomDelay,
  calculateReactionTime,
  isFalseStart,
  isSuspiciousReactionTime
} from '../utils/reactionTimeUtils';
import { calculateSessionStats, isPersonalBest } from '../utils/statistics';

export const GAME_STATES = {
  IDLE: 'idle',
  COUNTDOWN: 'countdown',
  STIMULUS: 'stimulus',
  RESPONDED: 'responded',
  FALSE_START: 'false_start',
  ROUND_END: 'round_end',
  SESSION_COMPLETE: 'session_complete'
};

export const GAME_MODES = {
  beginner: { name: 'Beginner', minDelay: 2000, maxDelay: 6000, rounds: 5 },
  standard: { name: 'Standard', minDelay: 1500, maxDelay: 5000, rounds: 5 },
  advanced: { name: 'Advanced', minDelay: 1000, maxDelay: 4000, rounds: 7 },
  expert: { name: 'Expert', minDelay: 800, maxDelay: 3000, rounds: 10 }
};

export const useGameState = (mode = 'standard') => {
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);
  const [currentMode, setCurrentMode] = useState(mode);
  const [currentRound, setCurrentRound] = useState(0);
  const [rounds, setRounds] = useState([]);
  const [stimulusTime, setStimulusTime] = useState(null);
  const [personalBest, setPersonalBest] = useState(null);

  const countdownTimerRef = useRef(null);
  const stimulusTimerRef = useRef(null);

  // Clean up timers on unmount
  const cleanupTimers = useCallback(() => {
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (stimulusTimerRef.current) {
      clearTimeout(stimulusTimerRef.current);
      stimulusTimerRef.current = null;
    }
  }, []);

  // Start a new game session
  const startGame = useCallback(() => {
    cleanupTimers();
    setGameState(GAME_STATES.COUNTDOWN);
    setCurrentRound(1);
    setRounds([]);
    setStimulusTime(null);

    const modeConfig = GAME_MODES[currentMode] || GAME_MODES.standard;
    const delay = generateRandomDelay(modeConfig.minDelay, modeConfig.maxDelay);
    const countdownStartTime = getTimestamp();

    countdownTimerRef.current = setTimeout(() => {
      const stimTime = getTimestamp();
      setStimulusTime(stimTime);
      setGameState(GAME_STATES.STIMULUS);

      // Set maximum response window (10 seconds)
      stimulusTimerRef.current = setTimeout(() => {
        handleTimeout();
      }, 10000);
    }, delay);

    return { delay, countdownStartTime };
  }, [currentMode, cleanupTimers]);

  // Record a response
  const recordResponse = useCallback((clickTime = null) => {
    if (gameState === GAME_STATES.STIMULUS && stimulusTime !== null) {
      const responseTime = clickTime || getTimestamp();
      const reactionTime = calculateReactionTime(stimulusTime, responseTime);

      if (isSuspiciousReactionTime(reactionTime)) {
        console.warn('Suspicious reaction time detected:', reactionTime);
      }

      const newRound = {
        roundNumber: currentRound,
        reactionTime,
        falseStart: false,
        delayBeforeStimulus: stimulusTime - (getTimestamp() - (stimulusTime - (getTimestamp() - (stimulusTime - countdownTimerRef.current?.startTime || 0)))),
        timestamp: new Date().toISOString()
      };

      setRounds(prev => [...prev, newRound]);
      cleanupTimers();
      setGameState(GAME_STATES.ROUND_END);

      setTimeout(() => {
        continueGame(newRound);
      }, 1500);
    }
  }, [gameState, stimulusTime, currentRound, cleanupTimers]);

  // Handle false start
  const handleFalseStart = useCallback((clickTime) => {
    const falseStartRound = {
      roundNumber: currentRound,
      reactionTime: 0,
      falseStart: true,
      timestamp: new Date().toISOString()
    };

    setRounds(prev => [...prev, falseStartRound]);
    cleanupTimers();
    setGameState(GAME_STATES.FALSE_START);

    // Retry the round after showing error
    setTimeout(() => {
      setGameState(GAME_STATES.COUNTDOWN);
      const modeConfig = GAME_MODES[currentMode] || GAME_MODES.standard;
      const delay = generateRandomDelay(modeConfig.minDelay, modeConfig.maxDelay);

      countdownTimerRef.current = setTimeout(() => {
        const stimTime = getTimestamp();
        setStimulusTime(stimTime);
        setGameState(GAME_STATES.STIMULUS);
      }, delay);
    }, 2000);
  }, [currentRound, currentMode, cleanupTimers]);

  // Handle timeout (no response within 10 seconds)
  const handleTimeout = useCallback(() => {
    const timeoutRound = {
      roundNumber: currentRound,
      reactionTime: 10000, // Cap at 10 seconds
      falseStart: false,
      timestamp: new Date().toISOString()
    };

    setRounds(prev => [...prev, timeoutRound]);
    cleanupTimers();
    setGameState(GAME_STATES.ROUND_END);

    setTimeout(() => {
      continueGame(timeoutRound);
    }, 1500);
  }, [currentRound, cleanupTimers]);

  // Continue to next round or finish session
  const continueGame = useCallback((lastRound) => {
    const modeConfig = GAME_MODES[currentMode] || GAME_MODES.standard;

    if (currentRound >= modeConfig.rounds) {
      // Session complete
      const stats = calculateSessionStats([...rounds, lastRound]);
      const isNewPB = personalBest === null || stats.best < personalBest;

      if (isNewPB) {
        setPersonalBest(stats.best);
      }

      setGameState(GAME_STATES.SESSION_COMPLETE);
    } else {
      // Start next round
      setTimeout(() => {
        startGame();
        setCurrentRound(prev => prev + 1);
      }, 1000);
    }
  }, [currentRound, currentMode, rounds, personalBest, startGame]);

  // Handle click during game
  const handleClick = useCallback(() => {
    const currentTime = getTimestamp();

    switch (gameState) {
      case GAME_STATES.COUNTDOWN:
        handleFalseStart(currentTime);
        break;
      case GAME_STATES.STIMULUS:
        recordResponse(currentTime);
        break;
      default:
        break;
    }
  }, [gameState, handleFalseStart, recordResponse]);

  // Reset game
  const resetGame = useCallback(() => {
    cleanupTimers();
    setGameState(GAME_STATES.IDLE);
    setCurrentRound(0);
    setRounds([]);
    setStimulusTime(null);
  }, [cleanupTimers]);

  // Change game mode
  const changeMode = useCallback((newMode) => {
    setCurrentMode(newMode);
    resetGame();
  }, [resetGame]);

  // Get session statistics
  const getSessionStats = useCallback(() => {
    return calculateSessionStats(rounds);
  }, [rounds]);

  return {
    gameState,
    currentMode,
    currentRound,
    rounds,
    stimulusTime,
    personalBest,
    startGame,
    handleClick,
    resetGame,
    changeMode,
    getSessionStats
  };
};
