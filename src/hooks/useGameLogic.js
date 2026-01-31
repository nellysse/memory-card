import { useEffect, useState, useCallback, useRef } from "react";

const PAIRS_COUNT = 4; 

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
    const allValues = cardValuesRef.current;
    

    const shuffledSource = shuffleArray([...allValues]);
    const selectedUnique = shuffledSource.slice(0, pairsCount);
    const combinedValues = [...selectedUnique, ...selectedUnique];
    const shuffledPairs = shuffleArray(combinedValues);

    const finalCards = shuffledPairs.map((value, index) => ({
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
  }, [pairsCount]);

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
          const flippedBackCards = cards.map((c) => {
            if (newFlippedCards.includes(c.id) || c.id === card.id) {
              return { ...c, isFlipped: false };
            } else {
              return c;
            }
          });

          setCards(flippedBackCards);
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
      
      setBestTime((prev) => {
        if (!prev || timer < prev) {
          localStorage.setItem("bestTime_medium", timer.toString());
          return timer;
        }
        return prev;
      });
      
      setBestMoves((prev) => {
        if (!prev || moves < prev) {
          localStorage.setItem("bestMoves_medium", moves.toString());
          return moves;
        }
        return prev;
      });

      const stats = JSON.parse(localStorage.getItem('gameStats') || '{"gamesPlayed": 0, "totalMoves": 0, "totalTime": 0}');
      stats.gamesPlayed += 1;
      stats.totalMoves += moves;
      stats.totalTime += timer;
      localStorage.setItem('gameStats', JSON.stringify(stats));
    }
    
  }, [isGameComplete, moves, timer]); 

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