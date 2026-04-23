import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/Sidebar.module.css";

const games = [
  { name: "Home", route: "/" },
  { name: "Word Scramble", route: "/games/scramble" },
  { name: "Hangman", route: "/games/hangman" },
  { name: "Wordle", route: "/games/wordle" },
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

      {!collapsed && <h2 className={styles.title}>Games</h2>}

      <nav>
        {games.map((game) => (
          <Link key={game.name} href={game.route}>
            <div className={styles.link}>
              {collapsed ? game.name[0] : game.name}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
