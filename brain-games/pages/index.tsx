import Link from "next/link";
import styles from "@/styles/Home.module.css";

const games = [
  {
    name: "Word Scramble",
    description: "Unscramble the letters!",
    route: "/games/scramble",
  },
  {
    name: "Hangman",
    description: "Guess the word to save the man!",
    route: "/games/hangman",
  },
  {
    name: "Wordle",
    description: "Guess the 5 letter word in 6 attempts.",
    route: "/games/wordle",
  },
];

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Brain Games</h1>
      <p className={styles.subtitle}>
        Choose a game and test your brain
      </p>

      <div className={styles.grid}>
        {games.map((game) => (
          <Link key={game.name} href={game.route}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                {game.emoji} {game.name}
              </h2>
              <p className={styles.cardDesc}>
                {game.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
