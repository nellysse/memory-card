export const GameHeader = ({
  score,
  moves,
  timer,
  formatTime,
  onReset,
  bestTime,
  bestMoves,
}) => {
  return (
    <header className="game-header">
      <h1>Memory Game</h1>
      <p className="subtitle">Flip two cards to find matching pairs.</p>
      <div className="stats">
        <span className="stat">Time: {formatTime(timer)}</span>
        <span className="stat">Moves: {moves}</span>
        <span className="stat">Pairs: {score}</span>
      </div>
      {(bestTime != null || bestMoves != null) && (
        <p className="best">
          Best — Time: {formatTime(bestTime ?? 0)} | Moves: {bestMoves ?? 0}
        </p>
      )}
      <button type="button" onClick={onReset}>
        New Game
      </button>
    </header>
  );
};
