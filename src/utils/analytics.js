import { format, parseISO, subDays, startOfDay, endOfDay, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { calculateAverage, calculateBest, calculateWorst, calculateStandardDeviation } from './statistics';

/**
 * Aggregate sessions by day
 */
export const aggregateSessionsByDay = (sessions, days = 30) => {
  const endDate = new Date();
  const startDate = subDays(endDate, days - 1);

  const dailyData = eachDayOfInterval({ start: startDate, end: endDate }).map(date => {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const daySessions = sessions.filter(session => {
      const sessionDate = parseISO(session.timestamp);
      return isWithinInterval(sessionDate, { start: dayStart, end: dayEnd });
    });

    const validSessions = daySessions.filter(s => s.stats.validRounds > 0);

    if (validSessions.length === 0) {
      return {
        date: format(date, 'yyyy-MM-dd'),
        displayDate: format(date, 'MMM dd'),
        gamesPlayed: 0,
        bestTime: null,
        averageTime: null,
        totalGames: 0
      };
    }

    const allTimes = validSessions.flatMap(s =>
      s.rounds.filter(r => !r.falseStart).map(r => r.reactionTime)
    );

    return {
      date: format(date, 'yyyy-MM-dd'),
      displayDate: format(date, 'MMM dd'),
      gamesPlayed: validSessions.length,
      bestTime: calculateBest(allTimes),
      averageTime: calculateAverage(allTimes),
      totalGames: daySessions.length
    };
  });

  return dailyData;
};

/**
 * Calculate weekly aggregates
 */
export const aggregateSessionsByWeek = (sessions, weeks = 12) => {
  const now = new Date();
  const weeklyData = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = subDays(now, i * 7);
    const weekEnd = subDays(now, (i - 1) * 7);

    const weekSessions = sessions.filter(session => {
      const sessionDate = parseISO(session.timestamp);
      return isWithinInterval(sessionDate, { start: weekStart, end: weekEnd });
    });

    const validSessions = weekSessions.filter(s => s.stats.validRounds > 0);
    const allTimes = validSessions.flatMap(s =>
      s.rounds.filter(r => !r.falseStart).map(r => r.reactionTime)
    );

    weeklyData.push({
      weekLabel: format(weekStart, 'MMM dd'),
      gamesPlayed: validSessions.length,
      averageTime: allTimes.length > 0 ? calculateAverage(allTimes) : null,
      bestTime: allTimes.length > 0 ? calculateBest(allTimes) : null
    });
  }

  return weeklyData;
};

/**
 * Calculate performance trend
 */
export const calculatePerformanceTrend = (sessions, period = 'week') => {
  const validSessions = sessions.filter(s => s.stats.validRounds > 0);

  if (validSessions.length < 2) {
    return { trend: 'stable', improvement: 0, message: 'Need more data to determine trend' };
  }

  const recentSessions = validSessions.slice(0, 10);
  const olderSessions = validSessions.slice(10, 20);

  if (olderSessions.length === 0) {
    return { trend: 'stable', improvement: 0, message: 'Building up data...' };
  }

  const recentAvg = calculateAverage(
    recentSessions.flatMap(s => s.rounds.filter(r => !r.falseStart).map(r => r.reactionTime))
  );

  const olderAvg = calculateAverage(
    olderSessions.flatMap(s => s.rounds.filter(r => !r.falseStart).map(r => r.reactionTime))
  );

  const improvement = ((olderAvg - recentAvg) / olderAvg) * 100;

  let trend = 'stable';
  let message = 'Your performance is consistent';

  if (improvement > 5) {
    trend = 'improving';
    message = `Great job! You've improved by ${improvement.toFixed(1)}%`;
  } else if (improvement < -5) {
    trend = 'declining';
    message = `Performance decreased by ${Math.abs(improvement).toFixed(1)}%. Keep practicing!`;
  }

  return { trend, improvement, message };
};

/**
 * Calculate mode-specific statistics
 */
export const calculateModeStatistics = (sessions) => {
  const modeStats = {};

  sessions.forEach(session => {
    const mode = session.mode;
    if (!modeStats[mode]) {
      modeStats[mode] = {
        mode,
        gamesPlayed: 0,
        allTimes: []
      };
    }

    if (session.stats.validRounds > 0) {
      modeStats[mode].gamesPlayed++;
      const validTimes = session.rounds.filter(r => !r.falseStart).map(r => r.reactionTime);
      modeStats[mode].allTimes.push(...validTimes);
    }
  });

  return Object.values(modeStats).map(stat => ({
    mode: stat.mode,
    gamesPlayed: stat.gamesPlayed,
    averageTime: stat.allTimes.length > 0 ? calculateAverage(stat.allTimes) : null,
    bestTime: stat.allTimes.length > 0 ? calculateBest(stat.allTimes) : null,
    standardDeviation: stat.allTimes.length > 0 ? calculateStandardDeviation(stat.allTimes) : null
  }));
};

/**
 * Get personal best history
 */
export const getPersonalBestHistory = (sessions) => {
  let bestTime = null;
  const history = [];

  const sortedSessions = [...sessions].sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  sortedSessions.forEach(session => {
    if (session.stats.validRounds > 0 && session.stats.best > 0) {
      if (bestTime === null || session.stats.best < bestTime) {
        bestTime = session.stats.best;
        history.push({
          timestamp: session.timestamp,
          time: bestTime,
          isNewPB: true
        });
      } else {
        history.push({
          timestamp: session.timestamp,
          time: session.stats.best,
          isNewPB: false
        });
      }
    }
  });

  return history;
};

/**
 * Generate automated insights
 */
export const generateInsights = (sessions, days = 30) => {
  const insights = [];
  const recentSessions = sessions.slice(0, 50);
  const dailyData = aggregateSessionsByDay(sessions, days);

  // Insight 1: Best performing day of the week
  const dayOfWeekStats = {};
  recentSessions.forEach(session => {
    const dayOfWeek = format(parseISO(session.timestamp), 'EEEE');
    if (!dayOfWeekStats[dayOfWeek]) {
      dayOfWeekStats[dayOfWeek] = [];
    }
    const validTimes = session.rounds.filter(r => !r.falseStart).map(r => r.reactionTime);
    if (validTimes.length > 0) {
      dayOfWeekStats[dayOfWeek].push(...validTimes);
    }
  });

  const dayAverages = Object.entries(dayOfWeekStats).map(([day, times]) => ({
    day,
    average: calculateAverage(times)
  }));

  if (dayAverages.length > 0) {
    dayAverages.sort((a, b) => a.average - b.average);
    const bestDay = dayAverages[0];
    insights.push({
      type: 'info',
      title: 'Best Performance Day',
      message: `Your fastest reactions are on ${bestDay.day}s (avg: ${bestDay.average.toFixed(0)}ms)`,
      icon: '📅'
    });
  }

  // Insight 2: Consistency score
  const allTimes = recentSessions.flatMap(s =>
    s.rounds.filter(r => !r.falseStart).map(r => r.reactionTime)
  );

  if (allTimes.length >= 10) {
    const stdDev = calculateStandardDeviation(allTimes);
    const avg = calculateAverage(allTimes);
    const consistency = Math.max(0, 100 - (stdDev / avg * 100));

    if (consistency > 80) {
      insights.push({
        type: 'success',
        title: 'Excellent Consistency',
        message: `You maintain very consistent reaction times! (${consistency.toFixed(0)}% consistency)`,
        icon: '🎯'
      });
    } else if (consistency < 50) {
      insights.push({
        type: 'warning',
        title: 'Work on Consistency',
        message: `Your reaction times vary quite a bit. Focus on steady performance!`,
        icon: '⚠️'
      });
    }
  }

  // Insight 3: Games played
  const totalGames = recentSessions.length;
  if (totalGames > 0) {
    insights.push({
      type: 'info',
      title: 'Activity',
      message: `You've played ${totalGames} games recently. Keep it up!`,
      icon: '🎮'
    });
  }

  // Insight 4: Improvement trend
  const trend = calculatePerformanceTrend(recentSessions);
  if (trend.trend === 'improving') {
    insights.push({
      type: 'success',
      title: 'Improving Performance',
      message: trend.message,
      icon: '📈'
    });
  } else if (trend.trend === 'declining') {
    insights.push({
      type: 'warning',
      title: 'Performance Dip',
      message: trend.message,
      icon: '📉'
    });
  }

  // Insight 5: False start rate
  const totalRounds = recentSessions.reduce((sum, s) => sum + s.stats.totalRounds, 0);
  const totalFalseStarts = recentSessions.reduce((sum, s) => sum + s.stats.falseStarts, 0);

  if (totalRounds > 0) {
    const falseStartRate = (totalFalseStarts / totalRounds) * 100;

    if (falseStartRate > 20) {
      insights.push({
        type: 'warning',
        title: 'Too Many False Starts',
        message: `False start rate: ${falseStartRate.toFixed(1)}%. Try to be more patient!`,
        icon: '🚫'
      });
    } else if (falseStartRate < 5 && totalRounds >= 25) {
      insights.push({
        type: 'success',
        title: 'Great Patience',
        message: `Low false start rate (${falseStartRate.toFixed(1)}%). Excellent self-control!`,
        icon: '⏱️'
      });
    }
  }

  // Insight 6: Mode recommendation
  const modeStats = calculateModeStatistics(recentSessions);
  if (modeStats.length > 0) {
    const bestMode = modeStats.reduce((best, current) =>
      current.averageTime && best.averageTime && current.averageTime < best.averageTime ? current : best
    );

    insights.push({
      type: 'info',
      title: 'Mode Recommendation',
      message: `You perform best in ${bestMode.mode} mode. Try it more often!`,
      icon: '💡'
    });
  }

  return insights;
};

/**
 * Calculate statistics for time of day
 */
export const calculateTimeOfDayStats = (sessions) => {
  const hourlyStats = {};

  sessions.forEach(session => {
    const hour = format(parseISO(session.timestamp), 'HH');
    if (!hourlyStats[hour]) {
      hourlyStats[hour] = [];
    }
    const validTimes = session.rounds.filter(r => !r.falseStart).map(r => r.reactionTime);
    hourlyStats[hour].push(...validTimes);
  });

  return Object.entries(hourlyStats).map(([hour, times]) => ({
    hour: parseInt(hour),
    hourLabel: format(new Date().setHours(parseInt(hour)), 'ha'),
    averageTime: times.length > 0 ? calculateAverage(times) : null,
    sampleSize: times.length
  })).filter(stat => stat.sampleSize > 0);
};
