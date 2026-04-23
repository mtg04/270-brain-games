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
    <div className={styles.bulletin_board}>
      <h1 className={styles.title}>Bouchard&apos;s Brain Games</h1>
      <p className={styles.subtitle}>Choose a game and test your brain!</p>

      <div className={styles.menu}>
        <div className={`${styles.note} ${styles.note1}`}>Jay Bea</div>
        <div className={`${styles.note} ${styles.note2}`}>Mikey Goad</div>
        <div className={`${styles.note} ${styles.note3}`}>Audrey Street</div>
        <div className={`${styles.note} ${styles.note4}`}>More games soon!</div>

        <Link href="/games/scramble">
          <div className={`${styles.card} ${styles.game1}`}>
            <div>
              <div className={styles.cardTitle}>Word Scramble</div>
              <div className={styles.cardDesc}>Unscramble the letters!</div>
            </div>
            <div className={styles.arrow}>→</div>
          </div>
        </Link>

        <Link href="/games/hangman">
          <div className={`${styles.card} ${styles.game2}`}>
            <div>
              <div className={styles.cardTitle}>Hangman</div>
              <div className={styles.cardDesc}>Guess the word to save the man!</div>
            </div>
            <div className={styles.arrow}>→</div>
          </div>
        </Link>

        <Link href="/games/wordle">
          <div className={`${styles.card} ${styles.game3}`}>
            <div>
              <div className={styles.cardTitle}>Wordle</div>
              <div className={styles.cardDesc}>Guess the 5 letter word in 6 attempts.</div>
            </div>
            <div className={styles.arrow}>→</div>
          </div>
        </Link>
      </div>
    </div>
  </div>
);
}
