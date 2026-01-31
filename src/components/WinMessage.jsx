export const WinMessage = ({ moves, timer, formatTime, isNewRecord }) => {
  return (
    <div className="win-message">
      <h2>You won!</h2>
      <p>Time: {formatTime(timer)} | Moves: {moves}</p>
      {isNewRecord && <p className="new-record">New best!</p>}
    </div>
  );
};
