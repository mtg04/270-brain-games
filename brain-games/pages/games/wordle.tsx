import React, { useState, useEffect } from 'react';
import { checkWordleGuess, LetterStatus, getRandomWord } from '../../wordle.logic';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

export default function WordleGame() {
const [secretWord, setSecretWord] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const handleKeyUp = (e: KeyboardEvent) => {
    if (gameOver) return;

    if (e.key === 'Enter') {
      if (currentGuess.length !== WORD_LENGTH) return;
      
      const newGuesses = [...guesses, currentGuess.toUpperCase()];
      setGuesses(newGuesses);
      setCurrentGuess("");

      if (currentGuess.toUpperCase() === secretWord || newGuesses.length === MAX_GUESSES) {
        setGameOver(true);
      }
    }

    if (e.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }

    if (/^[A-Za-z]$/.test(e.key) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + e.key.toUpperCase());
    }
  };

useEffect(() => {
    const word = getRandomWord();
    setSecretWord(word);
    console.log("Secret word picked:", word);
  }, []);

useEffect(() => {
    if (!secretWord) return;
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentGuess, guesses, gameOver, secretWord]);

  return (
    <div 
    tabIndex={0}
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Arial', paddingTop: '50px' }}>
      <h1>Wordle</h1>
      
      <div style={{ display: 'grid', gridTemplateRows: `repeat(${MAX_GUESSES}, 1fr)`, gap: '5px' }}>
        {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => {
          const isGuessed = rowIndex < guesses.length;
          const isCurrent = rowIndex === guesses.length;
          const guessText = isGuessed ? guesses[rowIndex] : isCurrent ? currentGuess : "";
          const statuses = isGuessed ? checkWordleGuess(guessText, secretWord) : [];

          return (
            <div key={rowIndex} style={{ display: 'grid', gridTemplateColumns: `repeat(${WORD_LENGTH}, 1fr)`, gap: '5px' }}>
              {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                const char = guessText[colIndex] || "";
                const status = statuses[colIndex];
                
                let bgColor = '#fff';
                let textColor = '#000';
                if (status === 'correct') bgColor = '#6aaa64';
                if (status === 'present') bgColor = '#c9b458';
                if (status === 'absent') bgColor = '#787c7e';
                if (isGuessed) textColor = '#fff';

                return (
                  <div key={colIndex} style={{
                    width: '50px', height: '50px', border: '2px solid #ccc',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontSize: '24px', fontWeight: 'bold', backgroundColor: bgColor, color: textColor
                  }}>
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {gameOver && <h2 style={{ marginTop: '20px' }}>{guesses[guesses.length - 1] === secretWord ? "You won!" : `Loser. It was ${secretWord}`}</h2>}
      
      <button onClick={() => window.location.href = '/'} style={{ position: 'absolute', top: '20px', left: '20px', padding: '10px', cursor: 'pointer', zIndex: 100 }}>
        Main Menu
      </button>
    </div>
  );
}