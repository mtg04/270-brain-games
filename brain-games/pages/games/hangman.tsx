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

        <div style={{ marginBottom: "1rem" }}>
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
);