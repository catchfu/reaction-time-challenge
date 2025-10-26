# ⚡ Reaction Time Challenge

A visually engaging and scientifically accurate reaction time testing game built with React and Vite. Test your reflexes and see how fast you can react!

![Reaction Time Challenge](https://img.shields.io/badge/React-19.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-7.1.12-purple)

## 🎮 Features

### Core Gameplay
- **4 Difficulty Modes**: Beginner, Standard, Advanced, and Expert
- **High-Precision Timing**: Uses `performance.now()` for accurate measurements
- **False Start Detection**: Automatically detects and penalizes premature clicks
- **Session Statistics**: Track average, best, worst, median, and consistency scores
- **Personal Best Tracking**: Automatically tracks and displays your best scores
- **Persistent Storage**: Game sessions saved to localStorage

### Visual Feedback
- **Color-Coded Stimuli**: Clear visual cues for different game states
- **Performance Tiers**: Lightning, Excellent, Good, Average, Slow, Needs Improvement
- **Smooth Animations**: Pulse, bounce, and shake effects
- **Round Indicators**: Visual progress tracking with round dots
- **Responsive Design**: Works on desktop, tablet, and mobile

### Analytics
- **Real-Time Statistics**: Instant calculation of reaction time metrics
- **Session Breakdown**: Detailed analysis of each gaming session
- **Performance Insights**: Consistency scores and improvement tracking
- **History**: Local storage of up to 100 recent game sessions

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd reaction-time
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎯 How to Play

1. **Select Difficulty**: Choose from Beginner, Standard, Advanced, or Expert
2. **Click Start**: Prepare for the challenge
3. **Wait for Green**: The screen will turn green after a random delay (1.5-5 seconds)
4. **Click Immediately**: Click as soon as you see green
5. **Complete 5 Rounds**: Finish all rounds to see your results
6. **Track Progress**: View detailed statistics and personal bests

### ⚠️ Important Rules
- **Don't click early!** Clicking during the countdown is a false start
- **Click immediately** when the screen turns green
- **Consistency matters** - try to maintain steady reaction times

## 📊 Understanding Your Results

### Metrics Explained

- **Average**: Mean reaction time across all valid rounds
- **Best**: Fastest reaction time in the session
- **Worst**: Slowest reaction time in the session
- **Median**: Middle value when all times are sorted
- **Standard Deviation**: Measure of consistency (lower is better)
- **Consistency Score**: 0-100 rating based on variance

### Performance Tiers

| Tier | Range | Description |
|------|-------|-------------|
| Lightning | < 150ms | Lightning fast! (May be a false start) |
| Excellent | 150-250ms | Excellent reflexes! |
| Good | 250-350ms | Good job! |
| Average | 350-450ms | Not bad! |
| Slow | 450-600ms | Keep practicing! |
| Needs Improvement | > 600ms | Try again! |

## 🏗️ Project Structure

```
reaction-time/
├── src/
│   ├── components/
│   │   ├── Game/
│   │   │   ├── GameContainer.jsx
│   │   │   ├── Stimulus.jsx
│   │   │   └── RoundCounter.jsx
│   │   ├── UI/
│   │   │   ├── Button.jsx
│   │   │   └── Modal.jsx
│   │   ├── Stats/
│   │   │   ├── StatsDisplay.jsx
│   │   │   └── StatsChart.jsx
│   │   ├── LandingPage.jsx
│   │   ├── GameScreen.jsx
│   │   └── ResultsScreen.jsx
│   ├── hooks/
│   │   ├── useGameState.js
│   │   ├── useTimer.js
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   ├── reactionTimeUtils.js
│   │   └── statistics.js
│   ├── context/
│   │   └── GameContext.jsx
│   ├── data/
│   │   └── gameModes.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── dist/                 # Production build
├── DESIGN_DOC.md         # Complete design document
├── package.json
├── vite.config.js
└── index.html
```

## 🔧 Technical Implementation

### Timing Accuracy
- Uses `performance.now()` for high-resolution timestamps
- Accounts for hardware-level timing variations
- Detects and flags suspicious reaction times (< 100ms)

### State Management
- React hooks for local state
- Context API for global game state
- LocalStorage for persistence

### Game Modes

| Mode | Delay Range | Rounds | Description |
|------|------------|--------|-------------|
| Beginner | 2-6s | 5 | Simple color change |
| Standard | 1.5-5s | 5 | Color variations |
| Advanced | 1-4s | 7 | Multiple stimuli types |
| Expert | 0.8-3s | 10 | Complex patterns |

## 🎨 Customization

### Adding New Difficulty Modes
Edit `src/data/gameModes.js`:
```javascript
export const GAME_MODES_DATA = {
  custom: {
    id: 'custom',
    name: 'Custom',
    description: 'Your custom mode',
    difficulty: 5,
    color: '#9C27B0'
  }
};
```

Update `src/hooks/useGameState.js`:
```javascript
export const GAME_MODES = {
  // ... existing modes
  custom: { name: 'Custom', minDelay: 500, maxDelay: 2000, rounds: 3 }
};
```

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## 🚧 Future Enhancements

### Phase 2: Statistics & Persistence
- [ ] Enhanced analytics dashboard
- [ ] Historical data visualization
- [ ] Export data to CSV/JSON
- [ ] 30-day progress tracking

### Phase 3: Social Features
- [ ] Global leaderboards
- [ ] Friends system
- [ ] Head-to-head challenges
- [ ] Achievement system
- [ ] Social sharing

### Phase 4: Monetization
- [ ] Premium subscription
- [ ] Additional game variants
- [ ] Custom themes
- [ ] Ad integration
- [ ] Advanced analytics

### Phase 5: Advanced Features
- [ ] AI-powered insights
- [ ] Training mode
- [ ] Tournament system
- [ ] Pro statistics
- [ ] Video replay

## 🧪 Testing

Run tests (when implemented):
```bash
npm test
```

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Inspired by scientific reaction time testing protocols
- Built with React and Vite for optimal performance
- Designed for accessibility and mobile-first experience

---

**Made with ⚡ and React**

Test your reflexes at [http://localhost:5173](http://localhost:5173) when running in development mode!
