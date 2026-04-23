import React, { useState, useEffect } from 'react';
import { checkWordleGuess, getRandomWord } from '../../wordle.logic';
import Sidebar from "@/components/Sidebar"; 

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
      }}
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
  }, []);

  useEffect(() => {
    if (!secretWord) return;
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keyup', handleKeyUp); };
  }, [currentGuess, guesses, gameOver, secretWord]);

const PIXEL_FONT = "'Press Start 2P', system-ui";

return (
  <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
    
    <Sidebar />

    <div style={{ 
      flex: 1, 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      color: "#f1f5f9",
      fontFamily: PIXEL_FONT, 
      padding: "2rem"
    }}>
      
      <div style={{ 
        background: "#1e293b",
        padding: "2rem",
        borderRadius: "16px",
        width: "450px", 
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        
        {}
        <h1 style={{ 
          fontSize: "2rem", 
          marginBottom: "1.5rem", 
        }}>
          Wordle
        </h1>
        
        <div style={{ display: 'grid', gridTemplateRows: `repeat(${MAX_GUESSES}, 1fr)`, gap: '8px' }}>
          {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => {
            const isGuessed = rowIndex < guesses.length;
            const isCurrent = rowIndex === guesses.length;
            const guessText = isGuessed ? guesses[rowIndex] : isCurrent ? currentGuess : "";
            const statuses = isGuessed ? checkWordleGuess(guessText, secretWord) : [];

            return (
              <div key={rowIndex} style={{ display: 'grid', gridTemplateColumns: `repeat(${WORD_LENGTH}, 1fr)`, gap: '8px' }}>
                {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                  const char = guessText[colIndex] || "";
                  const status = statuses[colIndex];
                  
                  let bgColor = '#0f172a'; 
                  let borderColor = '#334155';
                  let textColor = '#fff';

                  if (status === 'correct') { bgColor = '#22c55e'; borderColor = '#22c55e'; }
                  else if (status === 'present') { bgColor = '#eab308'; borderColor = '#eab308'; }
                  else if (status === 'absent') { bgColor = '#475569'; borderColor = '#475569'; }
                  else if (char && isCurrent) { borderColor = '#64748b'; }

                  return (
                    <div key={colIndex} style={{
                      width: '60px', height: '60px', border: `2px solid ${borderColor}`, borderRadius: '4px', display: 'flex', 
                      justifyContent: 'center', alignItems: 'center', fontSize: '20px', backgroundColor: bgColor, color: textColor
                    }}>
                      {char}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {gameOver && (
          <h2 style={{ 
            marginTop: '20px', 
            fontSize: '1rem',
            color: guesses[guesses.length - 1] === secretWord ? "#22c55e" : "#ef4444" 
          }}>
            {guesses[guesses.length - 1] === secretWord ? "Correct!!" : `It was ${secretWord}`}
          </h2>
        )}
        
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            marginTop: '2rem',
            padding: '0.8rem 1.2rem', 
            borderRadius: '8px', 
            border: 'none', 
            background: '#3b82f6', 
            color: 'white', 
            cursor: 'pointer',
            fontFamily: PIXEL_FONT,
            fontSize: '0.7rem' 
          }}>
          New Game
        </button>
      </div>
    </div>
  </div>
); 
}