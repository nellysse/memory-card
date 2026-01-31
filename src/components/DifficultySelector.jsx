import { DIFFICULTIES } from '../constants/gameConfig';

export const DifficultySelector = ({ currentDifficulty, onSelect, disabled }) => {
  return (
    <div className="difficulty-selector">
      <h3 className="difficulty-title">Select Difficulty</h3>
      <div className="difficulty-buttons">
        {Object.entries(DIFFICULTIES).map(([key, config]) => (
          <button
            key={key}
            className={`difficulty-btn ${currentDifficulty === key ? 'active' : ''}`}
            onClick={() => onSelect(key)}
            disabled={disabled}
          >
            <span className="difficulty-emoji">{config.emoji}</span>
            <span className="difficulty-name">{config.name}</span>
            <span className="difficulty-info">
              {config.grid.rows}×{config.grid.cols}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
