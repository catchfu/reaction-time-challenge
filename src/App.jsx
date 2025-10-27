import React, { useState, useEffect, useCallback } from 'react';
import { useGameState, GAME_STATES } from './hooks/useGameState';
import { useGameSessions, useUserProfile } from './hooks/useLocalStorage';
import { isPersonalBest } from './utils/statistics';
import { PremiumProvider } from './context/PremiumContext';
import { trackRevenueEvent } from './utils/revenueTracking';

import LandingPage from './components/LandingPage';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ExportModal from './components/ExportModal';
import SubscriptionModal from './components/SubscriptionModal';
import PremiumGate from './components/PremiumGate';
import SubscriptionManagement from './components/SubscriptionManagement';
import Ad from './components/Ad';

const SCREENS = {
  LANDING: 'landing',
  GAME: 'game',
  RESULTS: 'results'
};

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.LANDING);
  const [selectedMode, setSelectedMode] = useState('standard');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showSubscriptionMgmt, setShowSubscriptionMgmt] = useState(false);
  const [premiumGate, setPremiumGate] = useState(null);
  const [gameCount, setGameCount] = useState(0);

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

      // Track revenue event
      trackRevenueEvent('game_completed', {
        mode: currentMode,
        stats
      });

      // Update game count for ads
      setGameCount(prev => prev + 1);

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

  // Show subscription modal
  const handleShowSubscription = useCallback(() => {
    trackRevenueEvent('subscription_modal_viewed');
    setShowSubscription(true);
  }, []);

  // Show premium gate
  const handleShowPremiumGate = useCallback((feature) => {
    setPremiumGate(feature);
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
            onShowSubscription={handleShowSubscription}
            onShowSubscriptionMgmt={() => setShowSubscriptionMgmt(true)}
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
            onShowSubscription={handleShowSubscription}
          />
        );

      default:
        return null;
    }
  };

  // Show ad after every 3 games (for non-premium users)
  const shouldShowAd = gameCount > 0 && gameCount % 3 === 0;

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

      {/* Subscription Modal */}
      {showSubscription && (
        <SubscriptionModal
          onClose={() => setShowSubscription(false)}
          onStartTrial={() => {}}
        />
      )}

      {/* Subscription Management Modal */}
      {showSubscriptionMgmt && (
        <SubscriptionManagement
          onClose={() => setShowSubscriptionMgmt(false)}
        />
      )}

      {/* Premium Gate */}
      {premiumGate && (
        <PremiumGate
          feature={premiumGate}
          onUpgrade={() => {
            setPremiumGate(null);
            setShowSubscription(true);
          }}
          onClose={() => setPremiumGate(null)}
        />
      )}

      {/* Ad - Show after every 3 games */}
      {shouldShowAd && <Ad position="interstitial" />}

      {/* Footer */}
      <footer style={{
        marginTop: '3rem',
        padding: '2rem',
        textAlign: 'center',
        opacity: 0.5,
        fontSize: '0.85rem'
      }}>
        <div>Reaction Time Challenge - Phase 4 Monetization</div>
        <div style={{ marginTop: '0.5rem' }}>
          Built with ⚡, React, Recharts & Premium Features
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <PremiumProvider>
      <AppContent />
    </PremiumProvider>
  );
}

export default App;
