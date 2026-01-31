import { useState, useEffect } from "react";

export const Statistics = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    totalMoves: 0,
    totalTime: 0,
  });

  useEffect(() => {
    if (isOpen) {
      const savedStats = JSON.parse(
        localStorage.getItem("gameStats") ||
          '{"gamesPlayed": 0, "totalMoves": 0, "totalTime": 0}'
      );
      setStats(savedStats);
    }
  }, [isOpen]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m ${secs}s`;
  };

  const avgMoves = stats.gamesPlayed > 0
    ? Math.round(stats.totalMoves / stats.gamesPlayed)
    : 0;

  const avgTime = stats.gamesPlayed > 0
    ? Math.round(stats.totalTime / stats.gamesPlayed)
    : 0;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        
        <h2 className="modal-title">📊 Statistics</h2>
        
        <div className="stats-list">
          <div className="stats-item">
            <div className="stats-item-label">Games Played</div>
            <div className="stats-item-value">{stats.gamesPlayed}</div>
          </div>
          
          <div className="stats-item">
            <div className="stats-item-label">Total Time</div>
            <div className="stats-item-value">{formatTime(stats.totalTime)}</div>
          </div>
          
          <div className="stats-item">
            <div className="stats-item-label">Average Moves</div>
            <div className="stats-item-value">{avgMoves}</div>
          </div>
          
          <div className="stats-item">
            <div className="stats-item-label">Average Time</div>
            <div className="stats-item-value">{formatTime(avgTime)}</div>
          </div>
        </div>

        <button className="reset-stats-btn" onClick={() => {
          if (window.confirm('Are you sure you want to reset all statistics?')) {
            localStorage.removeItem('gameStats');
            localStorage.removeItem('bestTime_easy');
            localStorage.removeItem('bestTime_medium');
            localStorage.removeItem('bestTime_hard');
            localStorage.removeItem('bestMoves_easy');
            localStorage.removeItem('bestMoves_medium');
            localStorage.removeItem('bestMoves_hard');
            setStats({ gamesPlayed: 0, totalMoves: 0, totalTime: 0 });
          }
        }}>
          Reset Statistics
        </button>
      </div>
    </div>
  );
};
