import { useEffect, useState } from "react";
import words from "an-array-of-english-words";

const wordList: string[] = words;
const MAX_WRONG = 6;

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
	"/hangman1.png",
	"/hangman2.png",
	"/hangman3.png",
	"/hangman4.png",
	"/hangman5.png",
	"/hangman6.png",
	"/hangman7.png",
	"/hangman8.png"
    ];

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
        background: "#0f172a",
        color: "#f1f5f9",
        fontFamily: "sans-serif",
        position: "relative"
    };

    const cardStyle = {
        background: "#1e293b",
        padding: "2rem",
        borderRadius: "16px",
        width: "400px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        marginTop: "800px"
    };

    /* ---------------- UI ---------------- */

    return (
        <div style={containerStyle}>

            {/* TOP TITLE */}
            <h1 style={{
                textAlign: "center",
                paddingTop: "20px",
                fontSize: "2.5rem"
            }}>
                Hangman
            </h1>

	    <img
		src="/chalkboard.png"
		alt="chalkboard"
		style={{
		    position: "absolute",
		    top: "120px",
		    left: "50%",
		    transform: "translateX(-50%)",
		    width: "500px",
		    height: "auto",
		    zIndex: 1
		}}
	    />

            {/* RIGHT LETTER BANK */}
            <div style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)"
            }}>
                <strong>Wrong</strong>
                <div>{wrongLetters.join(", ")}</div>
            </div>

            {/* CENTER CONTENT */}
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div>

                    {/* CARD */}
                    <div style={cardStyle}>

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
        </div>
    );
}
