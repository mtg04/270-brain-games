export function shuffleWord(word: string): string {
  const arr = word.split("");

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.join("");
}

export function isCorrectGuess(word: string, guess: string): boolean {
  return word.toLowerCase() === guess.toLowerCase();
}