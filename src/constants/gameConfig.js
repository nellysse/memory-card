// Game difficulty configurations

export const DIFFICULTIES = {
  easy: {
    name: 'Easy',
    grid: { rows: 3, cols: 4 },
    pairs: 6,
    emoji: '😊',
  },
  medium: {
    name: 'Medium',
    grid: { rows: 4, cols: 4 },
    pairs: 8,
    emoji: '🎯',
  },
  hard: {
    name: 'Hard',
    grid: { rows: 4, cols: 5 },
    pairs: 10,
    emoji: '🔥',
  },
};

export const CARD_SETS = {
  fruits: ['🍎', '🍌', '🍇', '🍊', '🍓', '🥝', '🍑', '🍒', '🍉', '🍍'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
  nature: ['🌸', '🌺', '🌻', '🌷', '🌹', '🌿', '🍀', '🌾', '🌵', '🌴'],
  sports: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸', '🏒', '🏑'],
  food: ['🍕', '🍔', '🌭', '🍟', '🍿', '🧇', '🥞', '🧈', '🥐', '🍩'],
};

export const getCardValues = (difficulty, theme = 'fruits') => {
  const pairs = DIFFICULTIES[difficulty].pairs;
  const availableCards = CARD_SETS[theme] || CARD_SETS.fruits;
  
  // Select required number of unique cards
  const selectedCards = availableCards.slice(0, pairs);
  
  // Create pairs
  return [...selectedCards, ...selectedCards];
};
