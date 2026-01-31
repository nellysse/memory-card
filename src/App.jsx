import { useMemo } from "react";
import { Card } from "./components/Card";
import { GameHeader } from "./components/GameHeader";
import { WinMessage } from "./components/WinMessage";
import { useGameLogic } from "./hooks/useGameLogic";

const CARD_VALUES = ["🍎", "🍌", "🍇", "🍊", "🍓", "🥝", "🍑", "🍒", "🍉", "🍍", "🥭", "🍐", "🥥", "🍋", "🫐", "🍈"];

function App() {
  const cardValues = useMemo(
    () => [...CARD_VALUES, ...CARD_VALUES],
    []
  );

  const {
    cards,
    score,
    moves,
    handleCardClick,
    initializeGame,
    isGameComplete,
    timer,
    formatTime,
    bestTime,
    bestMoves,
  } = useGameLogic(cardValues);

  const isNewRecord = isGameComplete && (
    (bestTime != null && timer <= bestTime) ||
    (bestMoves != null && moves <= bestMoves)
  );

  return (
    <div className="app">
      <GameHeader
        score={score}
        moves={moves}
        timer={timer}
        formatTime={formatTime}
        onReset={initializeGame}
        bestTime={bestTime}
        bestMoves={bestMoves}
      />

      {isGameComplete && (
        <WinMessage
          moves={moves}
          timer={timer}
          formatTime={formatTime}
          isNewRecord={isNewRecord}
        />
      )}

      <div className="cards-grid">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
}

export default App;
