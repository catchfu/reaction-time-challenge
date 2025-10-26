import React from 'react';
import { GAME_MODES_DATA } from '../data/gameModes';

const LandingPage = ({ onStartGame, selectedMode, onSelectMode }) => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1 className="title">⚡ Reaction Time Challenge</h1>
      <p className="subtitle">
        Test your reflexes and see how fast you can react!
      </p>

      <div style={{ margin: '3rem 0' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Choose Difficulty Mode
        </h2>
        <div className="mode-grid">
          {Object.values(GAME_MODES_DATA).map((mode) => (
            <div
              key={mode.id}
              className={`mode-card ${selectedMode === mode.id ? 'selected' : ''}`}
              onClick={() => onSelectMode(mode.id)}
              style={{
                borderColor: selectedMode === mode.id ? mode.color : 'transparent'
              }}
            >
              <div className="mode-name" style={{ color: mode.color }}>
                {mode.name}
              </div>
              <div className="mode-description">
                {mode.description}
              </div>
              <div style={{
                marginTop: '0.5rem',
                fontSize: '0.8rem',
                opacity: 0.6
              }}>
                {'★'.repeat(mode.difficulty)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={() => onStartGame(selectedMode)}
          style={{
            fontSize: '1.5rem',
            padding: '1rem 3rem',
            backgroundColor: GAME_MODES_DATA[selectedMode].color
          }}
        >
          Start Game
        </button>
      </div>

      <div style={{
        marginTop: '3rem',
        padding: '1.5rem',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        textAlign: 'left'
      }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>How to Play:</h3>
        <ol style={{ lineHeight: '1.8', opacity: 0.9 }}>
          <li>Select your difficulty mode</li>
          <li>Click "Start Game" and prepare yourself</li>
          <li>Wait for the screen to turn green</li>
          <li>Click as quickly as possible when you see the green screen</li>
          <li>Complete 5 rounds to see your results</li>
        </ol>
        <p style={{
          marginTop: '1rem',
          fontSize: '0.9rem',
          opacity: 0.7,
          fontStyle: 'italic'
        }}>
          ⚠️ Don't click early! False starts will count against you.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
