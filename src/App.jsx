import React, { useState, useEffect, useCallback } from 'react';
import { useGameState, GAME_STATES } from './hooks/useGameState';
import { useGameSessions, useUserProfile } from './hooks/useLocalStorage';
import { isPersonalBest } from './utils/statistics';

import LandingPage from './components/LandingPage';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';

const SCREENS = {
  LANDING: 'landing',
  GAME: 'game',
  RESULTS: 'results'
};

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.LANDING);
  const [selectedMode, setSelectedMode] = useState('standard');

  const {
    gameState,
    currentMode,
    currentRound,
    rounds,
    personalBest,
    startGame,
    handleClick,
    resetGame,
    changeMode,
    getSessionStats
  } = useGameState(selectedMode);

  const { addSession } = useGameSessions();
  const { profile, updateProfile } = useUserProfile();

  // Handle screen transitions
  useEffect(() => {
    if (gameState === GAME_STATES.SESSION_COMPLETE) {
      setCurrentScreen(SCREENS.RESULTS);
    } else if (gameState === GAME_STATES.IDLE) {
      setCurrentScreen(SCREENS.LANDING);
    } else {
      setCurrentScreen(SCREENS.GAME);
    }
  }, [gameState]);

  // Handle starting a game
  const handleStartGame = useCallback((mode) => {
    setSelectedMode(mode);
    changeMode(mode);
    startGame();
  }, [startGame, changeMode]);

  // Handle play again
  const handlePlayAgain = useCallback(() => {
    startGame();
  }, [startGame]);

  // Handle back to home
  const handleBackToHome = useCallback(() => {
    resetGame();
    setCurrentScreen(SCREENS.LANDING);
  }, [resetGame]);

  // Handle session completion
  useEffect(() => {
    if (gameState === GAME_STATES.SESSION_COMPLETE) {
      const stats = getSessionStats();
      const newSession = {
        id: Date.now().toString(),
        mode: currentMode,
        timestamp: new Date().toISOString(),
        rounds,
        stats,
        personalBest: isPersonalBest(stats.best, personalBest)
      };

      // Add session to storage
      addSession(newSession);

      // Update profile statistics
      const newTotalGames = (profile.totalGamesPlayed || 0) + 1;
      const newBestTime = personalBest === null || stats.best < personalBest
        ? stats.best
        : personalBest;

      updateProfile({
        totalGamesPlayed: newTotalGames,
        bestReactionTime: newBestTime
      });
    }
  }, [gameState, rounds, currentMode, getSessionStats, personalBest, addSession, updateProfile, profile]);

  // Handle mode selection on landing page
  const handleModeSelect = useCallback((mode) => {
    setSelectedMode(mode);
  }, []);

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case SCREENS.LANDING:
        return (
          <LandingPage
            onStartGame={handleStartGame}
            selectedMode={selectedMode}
            onSelectMode={handleModeSelect}
          />
        );

      case SCREENS.GAME:
        return (
          <GameScreen
            gameState={gameState}
            currentMode={currentMode}
            currentRound={currentRound}
            rounds={rounds}
            stimulusTime={null}
            personalBest={profile.bestReactionTime}
            onClick={handleClick}
          />
        );

      case SCREENS.RESULTS:
        const stats = getSessionStats();
        const isNewPB = profile.bestReactionTime === null ||
          stats.best < profile.bestReactionTime;

        return (
          <ResultsScreen
            stats={stats}
            isPersonalBest={isNewPB}
            onPlayAgain={handlePlayAgain}
            onBackToHome={handleBackToHome}
            currentMode={currentMode}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="app">
      {renderCurrentScreen()}

      {/* Footer */}
      <footer style={{
        marginTop: '3rem',
        padding: '2rem',
        textAlign: 'center',
        opacity: 0.5,
        fontSize: '0.85rem'
      }}>
        <div>Reaction Time Challenge</div>
        <div style={{ marginTop: '0.5rem' }}>
          Built with ⚡ and React
        </div>
      </footer>
    </div>
  );
}

export default App;
