import React from 'react';
import { GAME_MODES, GAME_STATES } from '../hooks/useGameState';
import { getPerformanceTier } from '../utils/reactionTimeUtils';

const GameScreen = ({
  gameState,
  currentMode,
  currentRound,
  rounds,
  stimulusTime,
  personalBest,
  onClick
}) => {
  const modeConfig = GAME_MODES[currentMode] || GAME_MODES.standard;
  const roundsCompleted = rounds.length;
  const isComplete = roundsCompleted >= modeConfig.rounds;

  const getGameAreaClass = () => {
    switch (gameState) {
      case GAME_STATES.COUNTDOWN:
        return 'game-area waiting pulse';
      case GAME_STATES.STIMULUS:
        return 'game-area stimulus';
      case GAME_STATES.FALSE_START:
        return 'game-area false-start';
      default:
        return 'game-area neutral';
    }
  };

  const renderGameContent = () => {
    switch (gameState) {
      case GAME_STATES.COUNTDOWN:
        return (
          <>
            <div className="status-text">Wait for green...</div>
            <div style={{
              fontSize: '1rem',
              opacity: 0.7,
              marginTop: '0.5rem'
            }}>
              Don't click yet!
            </div>
          </>
        );

      case GAME_STATES.STIMULUS:
        return (
          <>
            <div className="game-text">CLICK!</div>
            <div style={{
              fontSize: '1rem',
              opacity: 0.8,
              marginTop: '0.5rem'
            }}>
              Now!
            </div>
          </>
        );

      case GAME_STATES.FALSE_START:
        return (
          <>
            <div className="game-text" style={{ color: 'white' }}>❌</div>
            <div style={{
              fontSize: '1.2rem',
              color: 'white',
              marginTop: '0.5rem'
            }}>
              False Start!
            </div>
            <div style={{
              fontSize: '0.9rem',
              opacity: 0.8,
              marginTop: '0.5rem'
            }}>
              Try again...
            </div>
          </>
        );

      case GAME_STATES.ROUND_END:
        const lastRound = rounds[rounds.length - 1];
        if (lastRound && !lastRound.falseStart) {
          const tier = getPerformanceTier(lastRound.reactionTime);
          return (
            <>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                fontFamily: 'monospace'
              }}>
                {lastRound.reactionTime.toFixed(0)}ms
              </div>
              <div style={{
                fontSize: '1.2rem',
                marginTop: '0.5rem',
                color: tier.color,
                fontWeight: 'bold'
              }}>
                {tier.name}
              </div>
            </>
          );
        }
        return null;

      default:
        return (
          <>
            <div className="status-text">Get Ready...</div>
          </>
        );
    }
  };

  const getRoundDisplay = () => {
    if (gameState === GAME_STATES.IDLE) return null;

    return (
      <div className="round-counter">
        Round {currentRound} / {modeConfig.rounds}
      </div>
    );
  };

  const renderRoundDots = () => {
    return (
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px'
      }}>
        {Array.from({ length: modeConfig.rounds }, (_, i) => (
          <div
            key={i}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: i < roundsCompleted ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)',
              transition: 'background-color 0.3s ease'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      {getRoundDisplay()}

      <div
        className={getGameAreaClass()}
        onClick={onClick}
        style={{
          width: '100%',
          height: '500px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: gameState === GAME_STATES.STIMULUS ? 'pointer' : 'default',
          userSelect: 'none'
        }}
      >
        {renderGameContent()}

        {gameState === GAME_STATES.COUNTDOWN && (
          <div style={{
            position: 'absolute',
            bottom: '30px',
            fontSize: '0.9rem',
            opacity: 0.6
          }}>
            Wait for green, then click immediately!
          </div>
        )}

        {renderRoundDots()}
      </div>

      {personalBest && gameState === GAME_STATES.ROUND_END && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderRadius: '8px',
          border: '1px solid #4CAF50'
        }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Personal Best</div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#4CAF50',
            fontFamily: 'monospace'
          }}>
            {personalBest.toFixed(0)}ms
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
