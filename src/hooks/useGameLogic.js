import { useEffect, useState, useCallback, useRef } from "react";

const PAIRS_COUNT = 4; // medium: 4 pairs = 8 cards, 2x4 grid

export const useGameLogic = (cardValues) => {
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

  const pairsCount = PAIRS_COUNT;
  const cardValuesRef = useRef(cardValues);
  cardValuesRef.current = cardValues;

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = useCallback(() => {
    // cardValues is [unique1..uniqueN, unique1..uniqueN]; take pairsCount unique, then duplicate for pairs
    const allValues = cardValuesRef.current;
    const uniqueValues = allValues.slice(0, allValues.length / 2).slice(0, pairsCount);
    const selectedValues = [...uniqueValues, ...uniqueValues]; // each icon twice = pairs
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
  }, []);

  useEffect(() => {
    const savedBestTime = localStorage.getItem("bestTime_medium");
    const savedBestMoves = localStorage.getItem("bestMoves_medium");
    
    if (savedBestTime) setBestTime(parseInt(savedBestTime));
    if (savedBestMoves) setBestMoves(parseInt(savedBestMoves));
  }, []);

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
      
      const firstCard = cards.find((c) => c.id === flippedCards[0]);
      if (!firstCard) return;

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
        localStorage.setItem("bestTime_medium", timer.toString());
      }
      
      if (!bestMoves || moves < bestMoves) {
        setBestMoves(moves);
        localStorage.setItem("bestMoves_medium", moves.toString());
      }

      const stats = JSON.parse(localStorage.getItem('gameStats') || '{"gamesPlayed": 0, "totalMoves": 0, "totalTime": 0}');
      stats.gamesPlayed += 1;
      stats.totalMoves += moves;
      stats.totalTime += timer;
      localStorage.setItem('gameStats', JSON.stringify(stats));
    }
  }, [isGameComplete, moves, timer, bestTime, bestMoves]);

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
  };
};
