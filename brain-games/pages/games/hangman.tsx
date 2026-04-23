import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useLocalStorage } from "@/components/useLocalStorage";
import styles from "@/styles/UI.module.css";
import words from "an-array-of-english-words";

const wordList: string[] = words;
const MAX_WRONG = 7;

function chooseWord(list: string[]): string {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

export default function App() {
    const [word, setWord] = useState<string>("");
    const [wrongGuesses, setWrongGuesses] = useState<number>(0);
    const [wrongLetters, setWrongLetters] = useState<string[]>([]);
    const [correctLetters, setCorrectLetters] = useState<string[]>([]);
    const [input, setInput] = useState<string>("");
    const [gameOver, setGameOver] = useState<boolean>(false);
    const hangmanImages = [
	"/Sprites/hangman0.png",
	"/Sprites/hangman1.png",
	"/Sprites/hangman2.png",
	"/Sprites/hangman3.png",
	"/Sprites/hangman4.png",
	"/Sprites/hangman5.png",
	"/Sprites/hangman6.png",
	"/Sprites/hangman7.png",
    ];

  type HangmanStats = {
    wins: number;
    losses: number;
    gamesPlayed: number;
    streak: number;
    bestStreak: number;
  };

  const [stats, setStats] = useLocalStorage<HangmanStats>("hangmanStats", {
    wins: 0,
    losses: 0,
    gamesPlayed: 0,
    streak: 0,
    bestStreak: 0,
  });

  const [resultRecorded, setResultRecorded] = useState<boolean>(false);

  useEffect(() => {
    setWord(chooseWord(wordList));
  }, []);

  function newRound() {
    setWord(chooseWord(wordList));
    setWrongGuesses(0);
    setWrongLetters([]);
    setCorrectLetters([]);
    setInput("");
    setGameOver(false);
  }

  function getWordDisplay(): string {
    let result = "";

    for (let i = 0; i < word.length; ++i) {
      let letter = word[i];

      if (correctLetters.includes(letter)) {
        result = result + letter + " ";
      } else {
        result = result + "_ ";
      }
    }

    return result.trim();
  }

  function guessLetter(letter: string) {
    if (gameOver) return;

    if (wrongLetters.includes(letter) || correctLetters.includes(letter)) {
      return;
    }

    if (word.includes(letter)) {
      const newCorrectLetters = [...correctLetters, letter];
      setCorrectLetters(newCorrectLetters);

      let win = true;
      for (let i = 0; i < word.length; i++) {
        if (!newCorrectLetters.includes(word[i])) {
          win = false;
          break;
        }
      }

      if (win) {
        setGameOver(true);

        setStats((prev) => {
          const newStreak = prev.streak + 1;

          return {
            ...prev,
            wins: prev.wins + 1,
            gamesPlayed: prev.gamesPlayed + 1,
            streak: newStreak,
            bestStreak: Math.max(prev.bestStreak, newStreak),
          };
        });
      }
    } else {
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);
      setWrongLetters([...wrongLetters, letter]);

      if (newWrong >= MAX_WRONG) {
        setGameOver(true);

        setStats((prev) => ({
          ...prev,
          losses: prev.losses + 1,
          gamesPlayed: prev.gamesPlayed + 1,
          streak: 0,
        }));
      }
    }
  }

  function handleSubmit() {
    if (gameOver) return;

    if (input.length !== 1) {
      return;
    }

    guessLetter(input.toLowerCase());
    setInput("");
  }

  /* ---------------- STYLES ---------------- */

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "#f1f5f9",
    padding: "2rem",
    width: "100%",
  };

  const cardStyle = {
    background: "#1e293b",
    padding: "2rem",
    borderRadius: "16px",
    width: "500px",
    textAlign: "center" as const,
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  };

  /* ---------------- UI ---------------- */

  return (
  <div style={{ display: "flex" }}>
    <Sidebar />

    <div className={styles.hangmanPage}>
      <div className={styles.chalkboardCard}>
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "1rem",
          }}
        >
          Hangman
        </h1>

        <div style={{ marginBottom: "1rem" }} suppressHydrationWarning>
          <p suppressHydrationWarning>Wins: {stats.wins}</p>
          <p suppressHydrationWarning>Losses: {stats.losses}</p>
          <p suppressHydrationWarning>Streak: {stats.streak}</p>
          <p suppressHydrationWarning>Best Streak: {stats.bestStreak}</p>
        </div>

        <img
          src={hangmanImages[wrongGuesses]}
          alt="Hangman"
          style={{
            width: "220px",
            maxWidth: "100%",
            marginBottom: "1rem",
          }}
        />

        <div style={{ marginBottom: "1rem" }}>
          <strong>Wrong Letters:</strong>
          <div>{wrongLetters.join(", ") || "None"}</div>
        </div>

        <h2
          style={{
            letterSpacing: "8px",
            fontSize: "2rem",
            margin: "1.5rem 0",
          }}
        >
          {getWordDisplay()}
        </h2>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="Enter a letter"
          maxLength={1}
          style={{
            padding: "0.6rem",
            width: "40%",
            borderRadius: "8px",
            border: "none",
            outline: "none",
            textAlign: "center",
            fontSize: "1rem",
          }}
        />

        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: "0.6rem 1.2rem",
              marginRight: "0.5rem",
              borderRadius: "8px",
              border: "none",
              background: "#22c55e",
              color: "white",
              cursor: "pointer",
            }}
          >
            Guess
          </button>

          <button
            onClick={newRound}
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              border: "none",
              background: "#ef4444",
              color: "white",
              cursor: "pointer",
            }}
          >
            New Word
          </button>
        </div>

        <div style={{ marginTop: "1rem" }}>
          {gameOver && wrongGuesses < MAX_WRONG && (
            <p style={{ color: "#22c55e" }}>You win!</p>
          )}
          {gameOver && wrongGuesses >= MAX_WRONG && (
            <p style={{ color: "#ef4444" }}>
              You lose! The word was {word}.
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
)};