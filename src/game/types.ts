export type Cell = {
  value: string;
  status: "correct" | "wrong-position" | "not-in-equation" | "empty";
};

export type GameState = {
  board: Cell[][];
  equation: string;
  result: number;
  status: "winner" | "game-over" | "in-game";
  activeRow: number;
  activeColumn: number;
};

export type Level = "easy" | "medium";
