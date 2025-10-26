import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  aggregateSessionsByDay,
  aggregateSessionsByWeek,
  calculatePerformanceTrend,
  calculateModeStatistics,
  getPersonalBestHistory,
  generateInsights,
  calculateTimeOfDayStats
} from '../utils/analytics';
import { format, subDays } from 'date-fns';

const AnalyticsDashboard = ({ sessions, profile, onClose }) => {
  const [timeRange, setTimeRange] = useState(30);
  const [activeTab, setActiveTab] = useState('overview');

  const analytics = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return {
        dailyData: [],
        weeklyData: [],
        modeStats: [],
        personalBests: [],
        insights: [],
        timeOfDayStats: [],
        trend: { trend: 'stable', improvement: 0, message: 'No data yet' }
      };
    }

    const dailyData = aggregateSessionsByDay(sessions, timeRange);
    const weeklyData = aggregateSessionsByWeek(sessions, 12);
    const modeStats = calculateModeStatistics(sessions);
    const personalBests = getPersonalBestHistory(sessions);
    const insights = generateInsights(sessions, timeRange);
    const timeOfDayStats = calculateTimeOfDayStats(sessions);
    const trend = calculatePerformanceTrend(sessions);

    return {
      dailyData,
      weeklyData,
      modeStats,
      personalBests,
      insights,
      timeOfDayStats,
      trend
    };
  }, [sessions, timeRange]);

  const validSessions = sessions.filter(s => s.stats.validRounds > 0);
  const allTimes = validSessions.flatMap(s => s.rounds.filter(r => !r.falseStart).map(r => r.reactionTime));

  const overallStats = useMemo(() => {
    if (allTimes.length === 0) return null;

    const sum = allTimes.reduce((a, b) => a + b, 0);
    const avg = sum / allTimes.length;
    const best = Math.min(...allTimes);
    const worst = Math.max(...allTimes);

    return {
      average: avg,
      best,
      worst,
      totalGames: validSessions.length,
      totalRounds: allTimes.length
    };
  }, [allTimes, validSessions]);

  const renderOverviewTab = () => (
    <div className="analytics-tab-content">
      {/* Personal Bests */}
      {analytics.personalBests.length > 0 && (
        <div className="analytics-section">
          <h3>🏆 Personal Bests</h3>
          <div className="pb-history">
            {analytics.personalBests.slice(-5).reverse().map((pb, index) => (
              <div key={index} className={`pb-item ${pb.isNewPB ? 'new-pb' : ''}`}>
                <div className="pb-time">{pb.time.toFixed(0)}ms</div>
                <div className="pb-date">{format(new Date(pb.timestamp), 'MMM dd, yyyy')}</div>
                {pb.isNewPB && <div className="pb-badge">New!</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {analytics.insights.length > 0 && (
        <div className="analytics-section">
          <h3>💡 Insights</h3>
          <div className="insights-list">
            {analytics.insights.map((insight, index) => (
              <div key={index} className={`insight-item ${insight.type}`}>
                <div className="insight-icon">{insight.icon}</div>
                <div className="insight-content">
                  <div className="insight-title">{insight.title}</div>
                  <div className="insight-message">{insight.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trend */}
      <div className="analytics-section">
        <h3>📈 Performance Trend</h3>
        <div className={`trend-indicator ${analytics.trend.trend}`}>
          <div className="trend-icon">
            {analytics.trend.trend === 'improving' ? '📈' :
             analytics.trend.trend === 'declining' ? '📉' : '➡️'}
          </div>
          <div className="trend-content">
            <div className="trend-label">
              {analytics.trend.trend === 'improving' ? 'Improving' :
               analytics.trend.trend === 'declining' ? 'Declining' : 'Stable'}
            </div>
            <div className="trend-change">
              {analytics.trend.improvement > 0 ? '+' : ''}{analytics.trend.improvement.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="analytics-tab-content">
      {/* Daily History Chart */}
      <div className="analytics-section">
        <h3>Daily Performance (Last {timeRange} Days)</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="displayDate" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="averageTime"
                stroke="#4CAF50"
                fill="#4CAF50"
                fillOpacity={0.3}
                name="Average (ms)"
              />
              <Area
                type="monotone"
                dataKey="bestTime"
                stroke="#2196F3"
                fill="#2196F3"
                fillOpacity={0.3}
                name="Best (ms)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Trend */}
      {analytics.weeklyData.length > 0 && (
        <div className="analytics-section">
          <h3>Weekly Trend</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="weekLabel" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="averageTime"
                  stroke="#4CAF50"
                  strokeWidth={2}
                  name="Weekly Avg (ms)"
                  dot={{ fill: '#4CAF50' }}
                />
                <Line
                  type="monotone"
                  dataKey="bestTime"
                  stroke="#2196F3"
                  strokeWidth={2}
                  name="Weekly Best (ms)"
                  dot={{ fill: '#2196F3' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Personal Bests Timeline */}
      {analytics.personalBests.length > 0 && (
        <div className="analytics-section">
          <h3>Personal Best Timeline</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.personalBests}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                  stroke="#888"
                />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
                  labelStyle={{ color: '#fff' }}
                  labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                  formatter={(value) => [`${value.toFixed(0)}ms`, 'Personal Best']}
                />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="#FFD700"
                  strokeWidth={3}
                  dot={{ fill: '#FFD700', r: 6 }}
                  name="Personal Best"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );

  const renderBreakdownTab = () => (
    <div className="analytics-tab-content">
      {/* Mode Comparison */}
      {analytics.modeStats.length > 0 && (
        <div className="analytics-section">
          <h3>Mode Comparison</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.modeStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="mode" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="averageTime" fill="#2196F3" name="Average (ms)" />
                <Bar dataKey="bestTime" fill="#4CAF50" name="Best (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mode-stats-grid">
            {analytics.modeStats.map((stat, index) => (
              <div key={index} className="mode-stat-card">
                <div className="mode-name">{stat.mode}</div>
                <div className="mode-metric">
                  <span>Games:</span>
                  <strong>{stat.gamesPlayed}</strong>
                </div>
                <div className="mode-metric">
                  <span>Avg:</span>
                  <strong>{stat.averageTime ? `${stat.averageTime.toFixed(0)}ms` : 'N/A'}</strong>
                </div>
                <div className="mode-metric">
                  <span>Best:</span>
                  <strong>{stat.bestTime ? `${stat.bestTime.toFixed(0)}ms` : 'N/A'}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time of Day Analysis */}
      {analytics.timeOfDayStats.length > 0 && (
        <div className="analytics-section">
          <h3>Performance by Time of Day</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.timeOfDayStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="hourLabel" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="averageTime" fill="#FF9800" name="Average (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>📊 Analytics Dashboard</h2>
        <button className="close-button" onClick={onClose}>✕</button>
      </div>

      {/* Overall Stats */}
      {overallStats && (
        <div className="overall-stats">
          <div className="stat-card">
            <div className="stat-label">Average</div>
            <div className="stat-value">{overallStats.average.toFixed(0)}ms</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Best</div>
            <div className="stat-value best">{overallStats.best.toFixed(0)}ms</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Games</div>
            <div className="stat-value">{overallStats.totalGames}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Rounds</div>
            <div className="stat-value">{overallStats.totalRounds}</div>
          </div>
        </div>
      )}

      {/* Time Range Selector */}
      <div className="time-range-selector">
        <button
          className={timeRange === 7 ? 'active' : ''}
          onClick={() => setTimeRange(7)}
        >
          7 Days
        </button>
        <button
          className={timeRange === 30 ? 'active' : ''}
          onClick={() => setTimeRange(30)}
        >
          30 Days
        </button>
        <button
          className={timeRange === 90 ? 'active' : ''}
          onClick={() => setTimeRange(90)}
        >
          90 Days
        </button>
      </div>

      {/* Tabs */}
      <div className="analytics-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <button
          className={`tab ${activeTab === 'breakdown' ? 'active' : ''}`}
          onClick={() => setActiveTab('breakdown')}
        >
          Breakdown
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'history' && renderHistoryTab()}
      {activeTab === 'breakdown' && renderBreakdownTab()}
    </div>
  );
};

export default AnalyticsDashboard;
