import { format, parseISO } from 'date-fns';

/**
 * Export session data to JSON
 */
export const exportToJSON = (sessions, profile) => {
  const data = {
    exportDate: new Date().toISOString(),
    profile,
    sessions: sessions.map(session => ({
      ...session,
      // Convert Date objects to ISO strings for JSON serialization
      timestamp: session.timestamp,
      rounds: session.rounds.map(round => ({
        ...round,
        timestamp: round.timestamp
      }))
    }))
  };

  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, 'reaction-time-data.json', 'application/json');
};

/**
 * Export session data to CSV
 */
export const exportToCSV = (sessions) => {
  const headers = [
    'Date',
    'Mode',
    'Average (ms)',
    'Best (ms)',
    'Worst (ms)',
    'Median (ms)',
    'Std Dev (ms)',
    'Valid Rounds',
    'Total Rounds',
    'False Starts',
    'Consistency %'
  ];

  const rows = sessions.map(session => [
    format(parseISO(session.timestamp), 'yyyy-MM-dd HH:mm:ss'),
    session.mode,
    session.stats.average.toFixed(0),
    session.stats.best.toFixed(0),
    session.stats.worst.toFixed(0),
    session.stats.median.toFixed(0),
    session.stats.standardDeviation.toFixed(0),
    session.stats.validRounds,
    session.stats.totalRounds,
    session.stats.falseStarts,
    session.stats.consistencyScore.toFixed(0)
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  downloadFile(csvContent, 'reaction-time-sessions.csv', 'text/csv');
};

/**
 * Export detailed round data to CSV
 */
export const exportDetailedRoundsToCSV = (sessions) => {
  const headers = [
    'Date',
    'Mode',
    'Round #',
    'Reaction Time (ms)',
    'False Start',
    'Delay Before Stimulus (ms)'
  ];

  const rows = [];
  sessions.forEach(session => {
    session.rounds.forEach(round => {
      rows.push([
        format(parseISO(session.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        session.mode,
        round.roundNumber,
        round.reactionTime,
        round.falseStart ? 'Yes' : 'No',
        round.delayBeforeStimulus ? round.delayBeforeStimulus.toFixed(0) : ''
      ]);
    });
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  downloadFile(csvContent, 'reaction-time-rounds.csv', 'text/csv');
};

/**
 * Export statistics summary to CSV
 */
export const exportStatisticsToCSV = (sessions, dailyData, modeStats) => {
  // Daily stats
  const dailyHeaders = ['Date', 'Games Played', 'Best Time (ms)', 'Average Time (ms)', 'Total Games'];
  const dailyRows = dailyData.map(day => [
    day.date,
    day.gamesPlayed,
    day.bestTime ? day.bestTime.toFixed(0) : '',
    day.averageTime ? day.averageTime.toFixed(0) : '',
    day.totalGames
  ]);

  const dailyCSV = [dailyHeaders, ...dailyRows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  // Mode stats
  const modeHeaders = ['Mode', 'Games Played', 'Average Time (ms)', 'Best Time (ms)', 'Std Dev (ms)'];
  const modeRows = modeStats.map(stat => [
    stat.mode,
    stat.gamesPlayed,
    stat.averageTime ? stat.averageTime.toFixed(0) : '',
    stat.bestTime ? stat.bestTime.toFixed(0) : '',
    stat.standardDeviation ? stat.standardDeviation.toFixed(0) : ''
  ]);

  const modeCSV = [modeHeaders, ...modeRows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  // Combine both sections
  const combinedCSV = `Daily Statistics\n${dailyCSV}\n\nMode Statistics\n${modeCSV}`;

  downloadFile(combinedCSV, 'reaction-time-statistics.csv', 'text/csv');
};

/**
 * Generate and download a shareable text summary
 */
export const exportSummaryText = (sessions, profile, personalBests) => {
  const totalGames = sessions.length;
  const validSessions = sessions.filter(s => s.stats.validRounds > 0);

  if (validSessions.length === 0) {
    return;
  }

  const allTimes = validSessions.flatMap(s =>
    s.rounds.filter(r => !r.falseStart).map(r => r.reactionTime)
  );

  const summary = `
Reaction Time Challenge - Performance Summary
==============================================

Profile:
- Total Games Played: ${profile.totalGamesPlayed}
- Member Since: ${format(parseISO(profile.createdAt), 'MMMM dd, yyyy')}

Overall Statistics:
- Overall Average: ${(allTimes.reduce((a, b) => a + b, 0) / allTimes.length).toFixed(0)}ms
- Best Reaction Time: ${personalBests.current}ms
- Total Valid Rounds: ${allTimes.length}

Recent Performance (Last 10 Games):
${validSessions.slice(0, 10).map((session, i) => {
  const validTimes = session.rounds.filter(r => !r.falseStart).map(r => r.reactionTime);
  const avg = validTimes.length > 0 ? (validTimes.reduce((a, b) => a + b, 0) / validTimes.length).toFixed(0) : 'N/A';
  return `  ${i + 1}. ${session.mode} mode - Average: ${avg}ms (${format(parseISO(session.timestamp), 'MMM dd')})`;
}).join('\n')}

Generated on: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}
Visit my profile: [Your GitHub/Website]

Keep practicing! 🚀
  `.trim();

  downloadFile(summary, 'reaction-time-summary.txt', 'text/plain');
};

/**
 * Download file helper
 */
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate shareable image summary (using canvas)
 */
export const generateShareableImage = (profile, bestTime, recentAverage) => {
  // This is a placeholder for image generation
  // In a real implementation, you'd use HTML5 Canvas or a library like html2canvas
  console.log('Shareable image generation not yet implemented');

  // For now, return a simple object with data
  return {
    success: false,
    message: 'Image generation coming in Phase 3!'
  };
};

/**
 * Copy data to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generate shareable text for social media
 */
export const generateShareText = (bestTime, currentAverage, mode = 'standard') => {
  const text = `I just scored ${bestTime}ms in the Reaction Time Challenge on ${mode} mode!

My current average: ${currentAverage}ms

Can you beat me? 🎮⚡

#ReactionTime #Reflexes #BrowserGame #Challenge`;

  return text;
};
