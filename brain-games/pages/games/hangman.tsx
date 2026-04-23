import { useEffect, useState } from "react";
import  Sidebar  from "@/components/Sidebar";
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
	"/hangman0.png",
	"/hangman1.png",
	"/hangman2.png",
	"/hangman3.png",
	"/hangman4.png",
	"/hangman5.png",
	"/hangman6.png",
	"/hangman7.png",
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

    function newRound(){
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
	    
	    if (win){
		setGameOver(true);
 	    }
	
	} else {
	    const newWrong = wrongGuesses + 1
            setWrongGuesses(newWrong);
            setWrongLetters([...wrongLetters, letter]);
	
            if (newWrong >= MAX_WRONG) {
		setGameOver(true);
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

        <div style={containerStyle}>
            <div style={cardStyle}>
                {/* TOP TITLE */}
            <h1 style={{
                fontSize: "2rem",
                marginBottom: "1rem"
                }}>
                Hangman
            </h1>

            <div style={{ marginTop: "20px" }}>
                <p>Wins: {stats.wins}</p>
                <p>Losses: {stats.losses}</p>
                <p>Streak: {stats.streak}</p>
                <p>Best Streak: {stats.bestStreak}</p>
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

            {/* LETTER BANK */}
            <div style={{ marginBottom: "1rem" }}>
                <strong>Wrong Letters:</strong>
                <div>{wrongLetters.join(", ") || "None"}</div>
            </div>
	
            {/* WORD */}
            <h2 style={{
                letterSpacing: "8px",
                fontSize: "2rem",
                margin: "1.5rem 0",
                background: "#0f172a",
                padding: "1rem",
                borderRadius: "10px",
            }}>
                {getWordDisplay()}
            </h2>

            {/* INPUT */}
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                }}
                placeholder="Enter a letter"
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

                {/* BUTTONS */}
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

                {/* GAME STATE */}
                <div style={{ marginTop: "1rem" }}>
                    {gameOver && wrongGuesses < MAX_WRONG && <p style={{ color: "#22c55e" }}>You win!</p>}
                    {gameOver && wrongGuesses >= MAX_WRONG && <p style={{ color: "#ef4444" }}>You lose! Word was {word}</p>}
                </div>
            </div>
        </div>
	</div>
    );
}
