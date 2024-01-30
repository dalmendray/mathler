import { CELLS_PER_ROW } from "../game/constants";
import {
  evaluateArithmeticEquation,
  generateGame,
  moveNext,
} from "../game/gameUtils";

const VALID_EQUATIONS = [
  ["119-41", 78],
  ["9+21/7", 12],
  ["90/9+7", 17],
  ["18+6-3", 21],
  ["24*2-9", 39],
  ["112-47", 65],
  ["27*3-9", 72],
  ["28-3+7", 32],
  ["95/5+8", 27],
  ["132-59", 73],
  ["29+7*9", 92],
];

describe("GameUtils", () => {
  it("generates a correct game", () => {
    const game = generateGame("20/4+2");

    expect(game.activeColumn).toBe(0);
    expect(game.activeRow).toBe(0);
    expect(game.equation).toBe("20/4+2");
    expect(game.result).toBe(7);
    expect(game.status).toBe("in-game");
    expect(game.board).toHaveLength(6);
    expect(game.board[0]).toHaveLength(6);

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        expect(game.board[i][j].status).toBe("empty");
        expect(game.board[i][j].value).toBe("");
      }
    }
  });

  it("generates correct games", () => {
    for (let i = 0; i < 1000; i++) {
      const game = generateGame();

      const result = evaluateArithmeticEquation(game.equation);
      expect(game.equation.length).toBe(6);
      expect(game.result).toBe(result);
    }
  });

  it("evaluate function works", () => {
    for (const [equation, result] of VALID_EQUATIONS) {
      expect(evaluateArithmeticEquation(equation as string)).toBe(result);
    }
  });

  it("throws an error when evaluating an invalid equation", () => {
    expect(() => evaluateArithmeticEquation("test/45")).toThrow(
      "Invalid equation format"
    );

    expect(() => evaluateArithmeticEquation("34/(45+78)")).toThrow(
      "Invalid equation format"
    );
  });

  it("throws an error when dividing by 0", () => {
    expect(() => evaluateArithmeticEquation("34/0")).toThrow(
      "Division by zero is not allowed"
    );
  });

  it("move back at 0 doesnt move", () => {
    const { newRow, newColumn } = moveNext(0, 0, "");

    expect(newRow).toBe(0);
    expect(newColumn).toBe(0);
  });

  it("move next at length doesnt move", () => {
    const { newRow, newColumn } = moveNext(0, CELLS_PER_ROW, "8");

    expect(newRow).toBe(0);
    expect(newColumn).toBe(CELLS_PER_ROW);
  });

  it("move back works", () => {
    const { newRow, newColumn } = moveNext(1, 4, "");

    expect(newRow).toBe(1);
    expect(newColumn).toBe(3);
  });

  it("move next works", () => {
    const { newRow, newColumn } = moveNext(3, 2, "9");

    expect(newRow).toBe(3);
    expect(newColumn).toBe(3);
  });
});
