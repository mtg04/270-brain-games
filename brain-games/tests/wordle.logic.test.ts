import { checkWordleGuess } from "../pages/games/wordle.logic";

describe('Wordle Logic Tests', () => {
  test('Greens: should identify letters in the correct spot', () => {
    const result = checkWordleGuess("REACT", "REACT");
    expect(result).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
  });

  test('Yellows: should identify letters present but in the wrong spot', () => {
    const result = checkWordleGuess("TRADE", "REACT");
    // R is in REACT (at index 0), A is in REACT (at index 2)
    expect(result[1]).toBe('present'); 
    expect(result[2]).toBe('present');
  });

  test('Grays: should identify letters not in the word at all', () => {
    const result = checkWordleGuess("PLUMB", "REACT");
    expect(result).toEqual(['absent', 'absent', 'absent', 'absent', 'absent']);
  });
});
