import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/Sidebar.module.css";

const games = [
  {
    name: "Word Scramble",
    route: "/games/scramble",
    icon: "/UI/Sidebar/scramble_logo.png"
  },

  {
    name: "Hangman",
    route: "/games/hangman",
    icon: "/UI/Sidebar/hangman_logo.png"
  },

  {
    name: "Wordle",
    route: "/games/wordle",
    icon: "/UI/Sidebar/wordle_logo.png"
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <button
        className={styles.toggle}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "→" : "←"}
      </button>

      {!collapsed && (
        <Link href="/">
        <h2 className={styles.title}>Bouchard's Brain Games</h2>
      </Link>
)}

      <nav>
        {games.map((game) => (
          <Link key={game.name} href={game.route}>
            <div className={styles.link}>
              <img
                src={game.icon}
                alt={game.name}
                className={styles.icon}
              />
              {collapsed ? game.name[0] : game.name}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
