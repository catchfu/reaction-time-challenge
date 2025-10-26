import React, { useState } from 'react';
import {
  exportToJSON,
  exportToCSV,
  exportDetailedRoundsToCSV,
  exportStatisticsToCSV,
  exportSummaryText,
  copyToClipboard,
  generateShareText
} from '../utils/export';
import { aggregateSessionsByDay, calculateModeStatistics } from '../utils/analytics';

const ExportModal = ({ sessions, profile, onClose }) => {
  const [exportFormat, setExportFormat] = useState('json');
  const [exportType, setExportType] = useState('sessions');
  const [copied, setCopied] = useState(false);

  const validSessions = sessions.filter(s => s.stats.validRounds > 0);
  const allTimes = validSessions.flatMap(s => s.rounds.filter(r => !r.falseStart).map(r => r.reactionTime));

  const currentAverage = allTimes.length > 0
    ? (allTimes.reduce((a, b) => a + b, 0) / allTimes.length).toFixed(0)
    : 'N/A';

  const bestTime = profile.bestReactionTime || 'N/A';

  const handleExport = () => {
    switch (exportFormat) {
      case 'json':
        exportToJSON(sessions, profile);
        break;
      case 'csv':
        if (exportType === 'sessions') {
          exportToCSV(sessions);
        } else if (exportType === 'rounds') {
          exportDetailedRoundsToCSV(sessions);
        } else if (exportType === 'statistics') {
          const dailyData = aggregateSessionsByDay(sessions, 30);
          const modeStats = calculateModeStatistics(sessions);
          exportStatisticsToCSV(sessions, dailyData, modeStats);
        }
        break;
      case 'summary':
        exportSummaryText(sessions, profile, { current: bestTime });
        break;
      default:
        break;
    }
  };

  const handleCopyShareText = async () => {
    const shareText = generateShareText(bestTime, currentAverage, 'standard');
    const result = await copyToClipboard(shareText);

    if (result.success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="export-modal">
      <div className="export-modal-content">
        <div className="export-modal-header">
          <h2>📤 Export Data</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="export-section">
          <h3>Quick Share</h3>
          <p>Share your achievements with friends!</p>
          <div className="share-preview">
            <div className="share-stats">
              <div className="share-stat">
                <span className="label">Best Time:</span>
                <span className="value">{bestTime}ms</span>
              </div>
              <div className="share-stat">
                <span className="label">Average:</span>
                <span className="value">{currentAverage}ms</span>
              </div>
              <div className="share-stat">
                <span className="label">Games Played:</span>
                <span className="value">{sessions.length}</span>
              </div>
            </div>
            <button
              className={`copy-button ${copied ? 'copied' : ''}`}
              onClick={handleCopyShareText}
            >
              {copied ? '✓ Copied!' : '📋 Copy Share Text'}
            </button>
          </div>
        </div>

        <div className="export-section">
          <h3>Export Format</h3>
          <div className="export-options">
            <label className="export-option">
              <input
                type="radio"
                value="json"
                checked={exportFormat === 'json'}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              <div className="option-content">
                <strong>JSON</strong>
                <span>Complete data with all details</span>
              </div>
            </label>

            <label className="export-option">
              <input
                type="radio"
                value="csv"
                checked={exportFormat === 'csv'}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              <div className="option-content">
                <strong>CSV</strong>
                <span>Spreadsheet-compatible format</span>
              </div>
            </label>

            <label className="export-option">
              <input
                type="radio"
                value="summary"
                checked={exportFormat === 'summary'}
                onChange={(e) => setExportFormat(e.target.value)}
              />
              <div className="option-content">
                <strong>Text Summary</strong>
                <span>Human-readable summary</span>
              </div>
            </label>
          </div>
        </div>

        {exportFormat === 'csv' && (
          <div className="export-section">
            <h3>CSV Type</h3>
            <div className="export-type-options">
              <label className="export-option">
                <input
                  type="radio"
                  value="sessions"
                  checked={exportType === 'sessions'}
                  onChange={(e) => setExportType(e.target.value)}
                />
                <div className="option-content">
                  <strong>Session Summary</strong>
                  <span>One row per game session</span>
                </div>
              </label>

              <label className="export-option">
                <input
                  type="radio"
                  value="rounds"
                  checked={exportType === 'rounds'}
                  onChange={(e) => setExportType(e.target.value)}
                />
                <div className="option-content">
                  <strong>Detailed Rounds</strong>
                  <span>One row per individual round</span>
                </div>
              </label>

              <label className="export-option">
                <input
                  type="radio"
                  value="statistics"
                  checked={exportType === 'statistics'}
                  onChange={(e) => setExportType(e.target.value)}
                />
                <div className="option-content">
                  <strong>Aggregated Statistics</strong>
                  <span>Daily and mode-based summaries</span>
                </div>
              </label>
            </div>
          </div>
        )}

        <div className="export-section">
          <h3>Export Info</h3>
          <div className="export-info">
            <div className="info-item">
              <span className="label">Sessions:</span>
              <span className="value">{sessions.length}</span>
            </div>
            <div className="info-item">
              <span className="label">Valid Rounds:</span>
              <span className="value">
                {sessions.reduce((sum, s) => sum + s.stats.validRounds, 0)}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Date Range:</span>
              <span className="value">
                {sessions.length > 0
                  ? `${new Date(sessions[sessions.length - 1].timestamp).toLocaleDateString()} - ${new Date(sessions[0].timestamp).toLocaleDateString()}`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="export-modal-footer">
          <button className="button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button-success" onClick={handleExport}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
