export const Card = ({ card, onClick }) => {
  return (
    <div
      className={`card ${card.isFlipped ? "flipped" : ""} ${card.isMatched ? "matched" : ""}`}
      onClick={() => onClick(card)}
      onKeyDown={(e) => e.key === "Enter" && onClick(card)}
      role="button"
      tabIndex={0}
      aria-label={card.isFlipped || card.isMatched ? card.value : "Hidden card"}
    >
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{card.value}</div>
      </div>
    </div>
  );
};
