import React, { useState, useEffect, useCallback } from "react";
import { checkWordleGuess, getRandomWord } from "../../wordle.logic";
import Layout from "@/components/Layout";
import { useLocalStorage } from "@/components/useLocalStorage";

const wordLength = 5;
const maxGuesses = 6;

type WordleStats = {
  wins: number;
  losses: number;
  gamesPlayed: number;
};

export default function WordleGame() {
  const [secretWord, setSecretWord] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const [stats, setStats] = useLocalStorage<WordleStats>("wordleStats", {
    wins: 0,
    losses: 0,
    gamesPlayed: 0,
  });

  const newGame = () => {
    const word = getRandomWord();

    setSecretWord(word);
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);

    console.log("New word:", word);
  };

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) return;

      if (e.key === "Enter") {
        if (currentGuess.length !== WORD_LENGTH) return;

        const newGuesses = [...guesses, currentGuess.toUpperCase()];
        setGuesses(newGuesses);
        setCurrentGuess("");

        const won = currentGuess.toUpperCase() === secretWord;
        const finished = won || newGuesses.length === MAX_GUESSES;

        if (finished) {
          setGameOver(true);

          setStats((prev) => ({
            ...prev,
            wins: prev.wins + (won ? 1 : 0),
            losses: prev.losses + (won ? 0 : 1),
            gamesPlayed: prev.gamesPlayed + 1,
          }));
        }
      }

      if (e.key === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }

      if (/^[A-Za-z]$/.test(e.key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess((prev) => prev + e.key.toUpperCase());
      }
    },
    [currentGuess, guesses, gameOver, secretWord, setStats],
  );

  useEffect(() => {
    const word = getRandomWord();
    setSecretWord(word);
  }, []);

  useEffect(() => {
    if (!secretWord) return;
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyUp, secretWord]);

  return (
    <Layout>
      <div
        tabIndex={0}
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          paddingTop: "50px",
          background: "transparent",
          color: "#f1f5f9",
        }}
      >
        <div
          style={{
            background: "#3f2316",
            padding: "2rem",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            textAlign: "center",
            width: "320px",
            margin: "0 auto",
          }}
        >
          <h1>Wordle</h1>

          <div style={{ marginBottom: "1rem" }}>
            <p>Wins: {stats.wins}</p>
            <p>Losses: {stats.losses}</p>
            <p>Games: {stats.gamesPlayed}</p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateRows: `repeat(${MAX_GUESSES}, 1fr)`,
              gap: "5px",
              width: "275px",
              margin: "0 auto",
            }}
          >
            {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => {
              const isGuessed = rowIndex < guesses.length;
              const isCurrent = rowIndex === guesses.length;
              const guessText = isGuessed
                ? guesses[rowIndex]
                : isCurrent
                  ? currentGuess
                  : "";
              const statuses = isGuessed
                ? checkWordleGuess(guessText, secretWord)
                : [];

              return (
                <div
                  key={rowIndex}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${WORD_LENGTH}, 1fr)`,
                    gap: "5px",
                    margin: "0 auto",
                  }}
                >
                  {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                    const char = guessText[colIndex] || "";
                    const status = statuses[colIndex];

                    let bgColor = "#fff";
                    let textColor = "#000";
                    if (status === "correct") bgColor = "#6aaa64";
                    if (status === "present") bgColor = "#c9b458";
                    if (status === "absent") bgColor = "#787c7e";
                    if (isGuessed) textColor = "#fff";

                    return (
                      <div
                        key={colIndex}
                        style={{
                          width: "50px",
                          height: "50px",
                          border: "2px solid #ccc",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "stretch",
                          fontSize: "24px",
                          fontWeight: "bold",
                          backgroundColor: bgColor,
                          color: textColor,
                        }}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {gameOver && (
            <>
              <h2 style={{ marginTop: "20px" }}>
                {guesses[guesses.length - 1] === secretWord
                  ? "You won!"
                  : `Loser. It was ${secretWord}`}
              </h2>

              <button
                onClick={newGame}
                style={{
                  marginTop: "15px",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#3b82f6",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                New Game
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
