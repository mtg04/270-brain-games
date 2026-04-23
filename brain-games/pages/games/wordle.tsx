import React, { useState, useEffect } from 'react';
import { checkWordleGuess, getRandomWord } from '../../wordle.logic';
import Sidebar from "@/components/Sidebar"; 

const wordLength = 5;
const maxGuesses = 6;

export default function WordleGame() {
  const [secretWord, setSecretWord] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const handleKeyUp = (e: KeyboardEvent) => {
    if (gameOver) return;
    if (e.key === 'Enter') {
      if (currentGuess.length !== wordLength) return;
      const newGuesses = [...guesses, currentGuess.toUpperCase()];
      setGuesses(newGuesses);
      setCurrentGuess("");
      if (currentGuess.toUpperCase() === secretWord || newGuesses.length === maxGuesses) {
        setGameOver(true);
      }}
    if (e.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }
    if (/^[A-Za-z]$/.test(e.key) && currentGuess.length < wordLength) {
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

const getLetterStatuses = () => {
  const statuses: { [key: string]: string } = {};

  guesses.forEach((word) => {
    const result = checkWordleGuess(word, secretWord);
    word.split("").forEach((char, i) => {
      const currentStatus = result[i];
      // Logic: 'correct' overrides 'present', which overrides 'absent'
      if (currentStatus === "correct") {
        statuses[char] = "correct";
      } else if (currentStatus === "present" && statuses[char] !== "correct") {
        statuses[char] = "present";
      } else if (currentStatus === "absent" && !statuses[char]) {
        statuses[char] = "absent";
      }
    });
  });

  return statuses;
};

const letterStatuses = getLetterStatuses();
const alphabet = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

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
        
        <div style={{ display: 'grid', gridTemplateRows: `repeat(${maxGuesses}, 1fr)`, gap: '8px' }}>
          {Array.from({ length: maxGuesses }).map((_, rowIndex) => {
            const isGuessed = rowIndex < guesses.length;
            const isCurrent = rowIndex === guesses.length;
            const guessText = isGuessed ? guesses[rowIndex] : isCurrent ? currentGuess : "";
            const statuses = isGuessed ? checkWordleGuess(guessText, secretWord) : [];

            return (
              <div key={rowIndex} style={{ display: 'grid', gridTemplateColumns: `repeat(${wordLength}, 1fr)`, gap: '8px' }}>
                {Array.from({ length: wordLength }).map((_, colIndex) => {
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
            color: guesses[guesses.length - 1] === secretWord ? "#22c55e" : "#ef4444", whiteSpace: 'pre-line', lineHeight: '1.8'
          }}>
            {guesses[guesses.length - 1] === secretWord ? "Correct!!" : `Incorrect :(\nIt was ${secretWord}`}
          </h2>
        )}
        
        <div style={{ 
    display: 'flex', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    gap: '6px', 
    marginTop: '20px',
    maxWidth: '350px' 
  }}>
  {alphabet.map((letter) => {
    const status = letterStatuses[letter];
    
    let bgColor = '#334155'; 
    let opacity = 1;

    if (status === 'correct') bgColor = '#22c55e';
    else if (status === 'present') bgColor = '#eab308';
    else if (status === 'absent') {
      bgColor = '#0f172a';
      opacity = 0.5;
    }

    return (
      <div key={letter} style={{
        width: '30px',
        height: '40px',
        background: bgColor,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        fontSize: '0.5rem',
        fontFamily: PIXEL_FONT,
        opacity: opacity,
        transition: 'all 0.3s ease'
      }}>
        {letter}
      </div>
    );
  })}
</div>

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