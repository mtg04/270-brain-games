import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";

/* ---------------- WORD BANK ---------------- */

const WORDS = {
  easy: [
    // 3-letter
    "cat",
    "dog",
    "sun",
    "map",
    "pen",
    "cup",
    "hat",
    "bed",
    "car",
    "box",
    "run",
    "red",
    "top",
    "fan",
    "key",
    "lip",
    "net",
    "fog",
    "log",
    "bat",

    // 5-letter
    "apple",
    "grape",
    "stone",
    "plant",
    "chair",
    "table",
    "light",
    "sound",
    "water",
    "bread",
    "clock",
    "mouse",
    "train",
    "sweet",
    "green",
    "brown",
    "smile",
    "laugh",
    "drink",
    "bring",
    "crane",
    "flame",
    "glide",
    "pride",
    "trace",
    "blame",
    "frame",
    "shine",
    "spice",
    "slice",
  ],

  medium: [
    // 6-letter
    "planet",
    "bridge",
    "stream",
    "forest",
    "castle",
    "silver",
    "golden",
    "rocket",
    "puzzle",
    "jungle",
    "butter",
    "little",
    "battle",
    "travel",
    "animal",
    "memory",
    "random",
    "bright",
    "circle",
    "square",

    // 7-letter
    "teacher",
    "student",
    "country",
    "picture",
    "weather",
    "freedom",
    "problem",
    "success",
    "balance",
    "process",
    "journey",
    "capture",
    "monster",
    "network",
    "plastic",
    "traffic",
    "kitchen",
    "station",
    "diamond",
    "element",
  ],

  hard: [
    // longer 6–7+ mixed (harder due to structure)
    "complex",
    "dynamic",
    "program",
    "compute",
    "predict",
    "analyze",
    "iterate",
    "feature",
    "project",
    "compile",
    "execute",
    "optimize",
    "network",
    "storage",
    "virtual",
    "process",
    "thread",
    "library",

    // longer / trickier
    "function",
    "variable",
    "constant",
    "argument",
    "operator",
    "framework",
    "database",
    "component",
    "structure",
    "algorithm",
    "interface",
    "developer",
    "condition",
    "iteration",
    "parameter",
  ],
};

type Difficulty = "easy" | "medium" | "hard";
type Mode = "normal" | "timed";

/* ---------------- SHUFFLE ---------------- */

function shuffleWord(word: string): string {
  const arr = word.split("");

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.join("");
}

/* ---------------- COMPONENT ---------------- */

export default function Scramble() {
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [word, setWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");

  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [mode, setMode] = useState<Mode>("normal");

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- NEW ROUND ---------------- */

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
  };

  const newRound = (level?: Difficulty) => {
    const safeLevel = level ?? difficulty ?? "easy";

    const bank = WORDS[safeLevel];

    if (!bank) {
      console.error("Invalid difficulty:", safeLevel);
      return;
    }

    const randomWord = bank[Math.floor(Math.random() * bank.length)];

    let scrambledWord = shuffleWord(randomWord);
    while (scrambledWord === randomWord) {
      scrambledWord = shuffleWord(randomWord);
    }

    setWord(randomWord);
    setScrambled(scrambledWord);
    setGuess("");
    setMessage("");
    setRevealed(new Array(randomWord.length).fill(false));

    if (mode === "timed") {
      setTimeLeft(30);
      startTimer();
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  useEffect(() => {
    if (mode !== "timed") return;
    if (timeLeft > 0) return;

    setMessage("Time's up!");
    setStreak(0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTimeout(() => {
      newRound();
    }, 600);
  }, [timeLeft, mode]);

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    newRound("easy");
  }, []);

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = () => {
    if (!guess.trim()) return;

    if (guess.toLowerCase() === word) {
      setMessage("Correct!");
      setScore((s) => s + 1);
      setStreak((s) => {
        const newStreak = s + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });

      setTimeout(() => newRound(), 700);
    } else {
      setMessage("Wrong!");
      setStreak(0);
    }
  };

  const giveHint = () => {
    const hiddenIndexes = revealed
      .map((r, i) => (!r ? i : -1))
      .filter((i) => i !== -1);

    if (hiddenIndexes.length === 0) return;

    const randomIndex =
      hiddenIndexes[Math.floor(Math.random() * hiddenIndexes.length)];

    const newRevealed = [...revealed];
    newRevealed[randomIndex] = true;
    setRevealed(newRevealed);

    // If all revealed → auto win
    if (newRevealed.every(Boolean)) {
      setMessage("Auto-solved :(");
      setScore((s) => s + 1);

      setTimeout(() => newRound(), 700);
    }
  };

  /* ---------------- RESET ---------------- */

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setGuess("");
    setMessage("");
    newRound(difficulty);
  };

  /* ---------------- UI ---------------- */

  return (
    <Layout>
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#0f172a", // dark background
            color: "#f1f5f9",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              background: "#1e293b",
              padding: "2rem",
              borderRadius: "16px",
              width: "400px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            }}
          >
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              Word Scramble
            </h1>

            {/* Stats */}
            <div style={{ marginBottom: "1rem" }}>
              <div>
                Score: <strong>{score}</strong>
              </div>
              <div>
                Streak: <strong>{streak}</strong>
              </div>
              <div>
                Best: <strong>{bestStreak}</strong>
              </div>
            </div>

            {/* Mode Selector */}
            <div style={{ marginBottom: "1rem" }}>
              <label>Mode: </label>
              <select
                value={mode}
                onChange={(e) => {
                  const newMode = e.target.value as Mode;
                  setMode(newMode);

                  setTimeout(() => {
                    newRound(difficulty);
                  }, 0);
                }}
                style={{
                  padding: "0.4rem",
                  borderRadius: "6px",
                  marginLeft: "0.5rem",
                }}
              >
                <option value="normal">Normal</option>
                <option value="timed">Timed (30s)</option>
              </select>
            </div>

            {/* Difficulty */}
            <div style={{ marginBottom: "1rem" }}>
              <label>Difficulty: </label>
              <select
                value={difficulty}
                onChange={(e) => {
                  const level = e.target.value as Difficulty;
                  setDifficulty(level);
                  newRound(level);
                }}
                style={{
                  padding: "0.4rem",
                  borderRadius: "6px",
                  marginLeft: "0.5rem",
                }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Timer */}
            {mode === "timed" && <h3> {timeLeft}s</h3>}

            {/* Word */}
            <h2
              style={{
                letterSpacing: "8px",
                fontSize: "2rem",
                margin: "1.5rem 0",
                background: "#0f172a",
                padding: "1rem",
                borderRadius: "10px",
              }}
            >
              {scrambled.toUpperCase()}
            </h2>

            <h2
              style={{
                letterSpacing: "8px",
                fontSize: "1.8rem",
                margin: "1rem 0",
              }}
            >
              {word.split("").map((letter, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    width: "28px",
                    borderBottom: "2px solid white",
                    margin: "0 4px",
                    textAlign: "center",
                  }}
                >
                  {revealed[i] ? letter.toUpperCase() : "_"}
                </span>
              ))}
            </h2>

            {/* Input */}
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Enter your guess"
              style={{
                padding: "0.6rem",
                width: "80%",
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
                Submit
              </button>

              <button
                onClick={resetGame}
                style={{
                  padding: "0.6rem 1.2rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#ef4444",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Reset
              </button>

              <button
                onClick={giveHint}
                style={{
                  padding: "0.6rem 1.2rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#3b82f6",
                  color: "white",
                  cursor: "pointer",
                  marginLeft: "0.5rem",
                }}
              >
                Hint!
              </button>
            </div>

            <p
              style={{
                marginTop: "1rem",
                fontWeight: "bold",
                color: message.includes("Correct")
                  ? "#22c55e"
                  : message.includes("Time")
                    ? "#f59e0b"
                    : "#ef4444",
              }}
            >
              {message}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
