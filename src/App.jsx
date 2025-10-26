import React, { useState, useEffect, useCallback } from 'react';
import { useGameState, GAME_STATES } from './hooks/useGameState';
import { useGameSessions, useUserProfile } from './hooks/useLocalStorage';
import { isPersonalBest } from './utils/statistics';

import LandingPage from './components/LandingPage';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ExportModal from './components/ExportModal';

const SCREENS = {
  LANDING: 'landing',
  GAME: 'game',
  RESULTS: 'results'
};

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.LANDING);
  const [selectedMode, setSelectedMode] = useState('standard');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showExport, setShowExport] = useState(false);

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

  const { sessions, addSession } = useGameSessions();
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
            onShowAnalytics={() => setShowAnalytics(true)}
            onShowExport={() => setShowExport(true)}
            sessionsCount={sessions.length}
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
            onShowAnalytics={() => setShowAnalytics(true)}
            onShowExport={() => setShowExport(true)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="app">
      {renderCurrentScreen()}

      {/* Analytics Dashboard Modal */}
      {showAnalytics && (
        <AnalyticsDashboard
          sessions={sessions}
          profile={profile}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      {/* Export Modal */}
      {showExport && (
        <ExportModal
          sessions={sessions}
          profile={profile}
          onClose={() => setShowExport(false)}
        />
      )}

      {/* Footer */}
      <footer style={{
        marginTop: '3rem',
        padding: '2rem',
        textAlign: 'center',
        opacity: 0.5,
        fontSize: '0.85rem'
      }}>
        <div>Reaction Time Challenge - Phase 2 Enhanced</div>
        <div style={{ marginTop: '0.5rem' }}>
          Built with ⚡, React, and Recharts
        </div>
      </footer>
    </div>
  );
}

export default App;
