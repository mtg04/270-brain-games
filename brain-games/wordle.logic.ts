// wordle.logic.ts

export type LetterStatus = 'correct' | 'present' | 'absent';

export const WORD_LIST = [
  "ABACK", "ABASE", "ABATE", "ABBEY", "ABBOT", 
  "BEACH", "BEGIN", "BLACK", "BOARD", "BRICK",
  "CHAIR", "CLEAN", "CLOCK", "CLOUD", "COUNT",
  "DAILY", "DANCE", "DREAM", "DRINK", "DRIVE",
  "EARLY", "EARTH", "EMPTY", "ENTRY", "EXTRA",
  "FAITH", "FIELD", "FINAL", "FIRST", "FLIGHT",
  "GHOST", "GLASS", "GLOVE", "GREAT", "GREEN",
  "HAPPY", "HEART", "HEAVY", "HOUSE", "HUMOR",
  "IDEAL", "IMAGE", "INDEX", "INNER", "INPUT",
  "JOINT", "JUDGE", "JUICE", "JOKER", "JUMPY",
  "KNIFE", "KNOCK", "KNOWN", "KNEAD", "KOALA",
  "LABEL", "LARGE", "LEARN", "LEVEL", "LIGHT",
  "MAGIC", "MAJOR", "MARCH", "MATCH", "METAL",
  "NIGHT", "NOISE", "NORTH", "NOVEL", "NURSE",
  "OCEAN", "OFFER", "ORDER", "OTHER", "OWNER",
  "PAINT", "PAPER", "PARTY", "PHONE", "PLANE",
  "QUICK", "QUIET", "QUITE", "QUOTE", "QUERY",
  "RADIO", "RAISE", "REACH", "READY", "RIGHT",
  "SCALE", "SCENE", "SHIRT", "SMALL", "SOUND",
  "TABLE", "THANK", "THEIR", "THING", "THINK",
  "UNDER", "UNTIL", "UPSET", "URBAN", "USAGE",
  "VALUE", "VIDEO", "VISIT", "VOICE", "VOTER",
  "WATCH", "WATER", "WHICH", "WHILE", "WORLD",
  "YACHT", "YOUTH", "YEARN", "YIELD", "YOUNG",
  "ZEBRA", "ZONAL", "ZESTY", "ZONES", "ZILCH"
];

export const getRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[randomIndex];
};

export const checkWordleGuess = (guess: string, secret: string): LetterStatus[] => {
  const result: LetterStatus[] = Array(5).fill('absent');
  const secretArr = secret.toLowerCase().split('');
  const guessArr = guess.toLowerCase().split('');

  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === secretArr[i]) {
      result[i] = 'correct';
      secretArr[i] = '';
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] !== 'correct' && secretArr.includes(guessArr[i])) {
      result[i] = 'present';
      const index = secretArr.indexOf(guessArr[i]);
      secretArr[index] = ''; 
    }
  }

  return result;
};

