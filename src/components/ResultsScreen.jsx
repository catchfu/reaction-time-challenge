import React from 'react';
import { getPerformanceTier } from '../utils/reactionTimeUtils';

const ResultsScreen = ({
  stats,
  isPersonalBest,
  onPlayAgain,
  onBackToHome,
  currentMode
}) => {
  const tier = getPerformanceTier(stats.average);

  const formatTime = (ms) => {
    return `${Math.round(ms)}ms`;
  };

  const renderRoundDots = () => {
    const validRounds = stats.validRounds;
    const totalRounds = stats.totalRounds;

    return (
      <div className="round-dots">
        {Array.from({ length: totalRounds }, (_, i) => (
          <div
            key={i}
            className={`round-dot ${i < validRounds ? 'completed' : ''}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="results-container">
      <h2 className="title">Results</h2>

      {isPersonalBest && (
        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          borderRadius: '12px',
          border: '2px solid #FFD700',
          margin: '2rem auto',
          maxWidth: '500px'
        }}>
          <div style={{
            fontSize: '2rem',
            marginBottom: '0.5rem'
          }}>
            🏆
          </div>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#FFD700'
          }}>
            New Personal Best!
          </div>
        </div>
      )}

      <div className="main-time" style={{ color: tier.color }}>
        {formatTime(stats.average)}
      </div>

      <div style={{
        fontSize: '1.2rem',
        marginBottom: '1rem',
        color: tier.color,
        fontWeight: 'bold'
      }}>
        {tier.name}
      </div>

      <div style={{
        fontSize: '0.9rem',
        opacity: 0.7,
        marginBottom: '2rem'
      }}>
        {tier.description}
      </div>

      {renderRoundDots()}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        margin: '3rem 0',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            fontSize: '0.9rem',
            opacity: 0.7,
            marginBottom: '0.5rem'
          }}>
            Fastest
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#4CAF50',
            fontFamily: 'monospace'
          }}>
            {formatTime(stats.best)}
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            fontSize: '0.9rem',
            opacity: 0.7,
            marginBottom: '0.5rem'
          }}>
            Slowest
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#FF9800',
            fontFamily: 'monospace'
          }}>
            {formatTime(stats.worst)}
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            fontSize: '0.9rem',
            opacity: 0.7,
            marginBottom: '0.5rem'
          }}>
            Median
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#2196F3',
            fontFamily: 'monospace'
          }}>
            {formatTime(stats.median)}
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            fontSize: '0.9rem',
            opacity: 0.7,
            marginBottom: '0.5rem'
          }}>
            Consistency
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#9C27B0',
            fontFamily: 'monospace'
          }}>
            {stats.consistencyScore.toFixed(0)}%
          </div>
        </div>
      </div>

      <div style={{
        padding: '1.5rem',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        margin: '2rem auto',
        maxWidth: '500px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <span style={{ opacity: 0.7 }}>Valid Rounds:</span>
          <span style={{ fontWeight: 'bold' }}>{stats.validRounds} / {stats.totalRounds}</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <span style={{ opacity: 0.7 }}>False Starts:</span>
          <span style={{ fontWeight: 'bold', color: stats.falseStarts > 0 ? '#FF5252' : '#4CAF50' }}>
            {stats.falseStarts}
          </span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span style={{ opacity: 0.7 }}>Standard Deviation:</span>
          <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
            {formatTime(stats.standardDeviation)}
          </span>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={onPlayAgain} className="button-success">
          Play Again
        </button>
        <button onClick={onBackToHome} className="button-secondary">
          Back to Home
        </button>
      </div>

      <div style={{
        marginTop: '2rem',
        fontSize: '0.85rem',
        opacity: 0.5
      }}>
        Mode: {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}
      </div>
    </div>
  );
};

export default ResultsScreen;
