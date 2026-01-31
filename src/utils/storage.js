// Utility functions for localStorage management

const STORAGE_KEYS = {
  BEST_SCORE: 'memoryCard_bestScore',
  BEST_TIME: 'memoryCard_bestTime',
  STATS: 'memoryCard_stats',
  DIFFICULTY: 'memoryCard_difficulty',
};

export const storage = {
  // Best score (minimum moves)
  getBestScore: (difficulty = 'medium') => {
    const scores = JSON.parse(localStorage.getItem(STORAGE_KEYS.BEST_SCORE) || '{}');
    return scores[difficulty] || null;
  },

  setBestScore: (score, difficulty = 'medium') => {
    const scores = JSON.parse(localStorage.getItem(STORAGE_KEYS.BEST_SCORE) || '{}');
    if (!scores[difficulty] || score < scores[difficulty]) {
      scores[difficulty] = score;
      localStorage.setItem(STORAGE_KEYS.BEST_SCORE, JSON.stringify(scores));
      return true; // New record!
    }
    return false;
  },

  // Best time
  getBestTime: (difficulty = 'medium') => {
    const times = JSON.parse(localStorage.getItem(STORAGE_KEYS.BEST_TIME) || '{}');
    return times[difficulty] || null;
  },

  setBestTime: (time, difficulty = 'medium') => {
    const times = JSON.parse(localStorage.getItem(STORAGE_KEYS.BEST_TIME) || '{}');
    if (!times[difficulty] || time < times[difficulty]) {
      times[difficulty] = time;
      localStorage.setItem(STORAGE_KEYS.BEST_TIME, JSON.stringify(times));
      return true; // New record!
    }
    return false;
  },

  // Game statistics
  getStats: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS) || JSON.stringify({
      gamesPlayed: 0,
      gamesWon: 0,
      totalMoves: 0,
      totalTime: 0,
    }));
  },

  updateStats: (won, moves, time) => {
    const stats = storage.getStats();
    stats.gamesPlayed += 1;
    if (won) stats.gamesWon += 1;
    stats.totalMoves += moves;
    stats.totalTime += time;
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  },

  resetStats: () => {
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.BEST_SCORE);
    localStorage.removeItem(STORAGE_KEYS.BEST_TIME);
  },

  // Difficulty preference
  getDifficulty: () => {
    return localStorage.getItem(STORAGE_KEYS.DIFFICULTY) || 'medium';
  },

  setDifficulty: (difficulty) => {
    localStorage.setItem(STORAGE_KEYS.DIFFICULTY, difficulty);
  },
};
