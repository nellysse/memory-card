import { useEffect, useState, useCallback } from "react";

const DIFFICULTY_SETTINGS = {
  easy: { pairs: 6, label: "Easy", grid: "3x4" },
  medium: { pairs: 8, label: "Medium", grid: "4x4" },
  hard: { pairs: 12, label: "Hard", grid: "4x6" },
};

export const useGameLogic = (cardValues, difficulty = "medium") => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [bestTime, setBestTime] = useState(null);
  const [bestMoves, setBestMoves] = useState(null);

  const pairsCount = DIFFICULTY_SETTINGS[difficulty].pairs;

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = useCallback(() => {
    const selectedValues = cardValues.slice(0, pairsCount);
    const shuffled = shuffleArray(selectedValues);

    const finalCards = shuffled.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(finalCards);
    setIsLocked(false);
    setMoves(0);
    setScore(0);
    setMatchedCards([]);
    setFlippedCards([]);
    setTimer(0);
    setIsTimerRunning(false);
  }, [cardValues, pairsCount]);

  useEffect(() => {
    const savedBestTime = localStorage.getItem(`bestTime_${difficulty}`);
    const savedBestMoves = localStorage.getItem(`bestMoves_${difficulty}`);
    
    if (savedBestTime) setBestTime(parseInt(savedBestTime));
    if (savedBestMoves) setBestMoves(parseInt(savedBestMoves));
  }, [difficulty]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleCardClick = (card) => {
    if (moves === 0 && flippedCards.length === 0) {
      setIsTimerRunning(true);
    }

    if (
      card.isFlipped ||
      card.isMatched ||
      isLocked ||
      flippedCards.length === 2
    ) {
      return;
    }

    const newCards = cards.map((c) => {
      if (c.id === card.id) {
        return { ...c, isFlipped: true };
      } else {
        return c;
      }
    });

    setCards(newCards);

    const newFlippedCards = [...flippedCards, card.id];
    setFlippedCards(newFlippedCards);

    if (flippedCards.length === 1) {
      setIsLocked(true);
      setMoves((prev) => prev + 1);
      
      const firstCard = cards[flippedCards[0]];

      if (firstCard.value === card.value) {
        setTimeout(() => {
          setMatchedCards((prev) => [...prev, firstCard.id, card.id]);
          setScore((prev) => prev + 1);
          setCards((prev) =>
            prev.map((c) => {
              if (c.id === card.id || c.id === firstCard.id) {
                return { ...c, isMatched: true };
              } else {
                return c;
              }
            })
          );

          setFlippedCards([]);
          setIsLocked(false);
        }, 600);
      } else {
        setTimeout(() => {
          const flippedBackCard = newCards.map((c) => {
            if (newFlippedCards.includes(c.id) || c.id === card.id) {
              return { ...c, isFlipped: false };
            } else {
              return c;
            }
          });

          setCards(flippedBackCard);
          setIsLocked(false);
          setFlippedCards([]);
        }, 1200);
      }
    }
  };

  const isGameComplete = matchedCards.length === pairsCount * 2;

  useEffect(() => {
    if (isGameComplete && moves > 0) {
      setIsTimerRunning(false);
      
      if (!bestTime || timer < bestTime) {
        setBestTime(timer);
        localStorage.setItem(`bestTime_${difficulty}`, timer.toString());
      }
      
      if (!bestMoves || moves < bestMoves) {
        setBestMoves(moves);
        localStorage.setItem(`bestMoves_${difficulty}`, moves.toString());
      }

      const stats = JSON.parse(localStorage.getItem('gameStats') || '{"gamesPlayed": 0, "totalMoves": 0, "totalTime": 0}');
      stats.gamesPlayed += 1;
      stats.totalMoves += moves;
      stats.totalTime += timer;
      localStorage.setItem('gameStats', JSON.stringify(stats));
    }
  }, [isGameComplete, moves, timer, bestTime, bestMoves, difficulty]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    cards,
    score,
    moves,
    isGameComplete,
    initializeGame,
    handleCardClick,
    timer,
    formatTime,
    bestTime,
    bestMoves,
    difficulty,
  };
};
