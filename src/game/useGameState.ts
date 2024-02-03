import { useEffect, useMemo, useState } from "react";

import {
  evaluateArithmeticEquation,
  generateGame,
  getValueCountMap,
  moveNext,
} from "./gameUtils";
import { getItem, setItem } from "./storage";
import { Cell, GameState } from "./types";

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>();

  const [gameError, setGameError] = useState("");

  const valueCount = useMemo(() => {
    if (gameState?.equation) {
      return getValueCountMap(gameState.equation);
    }
    return {};
  }, [gameState?.equation]);

  useEffect(() => {
    if (!gameState) {
      loadGame();
    }
  }, [gameState]);

  const loadGame = async () => {
    const gameStateJson = await getItem("gameState");

    let gameState: GameState;
    if (!gameStateJson) {
      gameState = generateGame();
    } else {
      gameState = JSON.parse(gameStateJson) as GameState;
    }

    setGameState(gameState);
  };

  const setValue = (value: string) => {
    const board = [...gameState.board];
    const rowIndex = gameState.activeRow;
    const columnIndex = gameState.activeColumn;

    const cell = board[rowIndex][columnIndex];

    board[rowIndex][columnIndex] = {
      ...cell,
      value,
    };

    const newIndexes = moveNext(rowIndex, columnIndex, value);

    const newGameState = {
      ...gameState,
      board,
      activeRow: newIndexes.newRow,
      activeColumn: newIndexes.newColumn,
    };

    setItem("gameState", JSON.stringify(newGameState));

    setGameState(newGameState);
    setGameError("");
  };

  const restartGame = async () => {
    const newGameState = generateGame();

    setItem("gameState", JSON.stringify(newGameState));

    setGameState(newGameState);
    setGameError("");
  };

  const onAnswer = () => {
    const row = gameState.activeRow;
    const equation = gameState.board[row].map((cell) => cell.value).join("");
    setGameError("");

    let answer: number;
    try {
      answer = evaluateArithmeticEquation(equation);
    } catch (error) {
      setGameError(error.message);
      return;
    }

    if (answer !== gameState.result) {
      setGameError(`Every guess must equal ${gameState.result}`);
      return;
    }

    if (gameState.equation === equation) {
      const board = [...gameState.board];

      const winnerRow: Cell[] = board[row].map((cell) => {
        return {
          ...cell,
          status: "correct",
        };
      });

      board[row] = winnerRow;

      setGameState({
        ...gameState,
        board,
        status: "winner",
      });
    } else {
      const board = [...gameState.board];

      const valueCountCopy = { ...valueCount };

      // verify correct and non-present values first
      const inputRow: Cell[] = board[row].map((cell, index) => {
        const validValue = gameState.equation[index];
        const inputValue = equation.charAt(index);

        if (validValue === inputValue) {
          valueCountCopy[inputValue]--;
          return {
            ...cell,
            status: "correct",
          };
        } else if (!gameState.equation.includes(inputValue)) {
          return {
            ...cell,
            status: "not-in-equation",
          };
        }

        return cell;
      });

      const inputRowMaybes: Cell[] = inputRow.map((cell, index) => {
        const inputValue = equation.charAt(index);

        if (
          gameState.equation.includes(inputValue) &&
          cell.status === "empty"
        ) {
          if (valueCountCopy[inputValue] === 0) {
            return {
              ...cell,
              status: "not-in-equation",
            };
          }

          valueCountCopy[inputValue]--;
          return {
            ...cell,
            status: "wrong-position",
          };
        }

        return cell;
      });

      board[row] = inputRowMaybes;

      let newGameState: GameState;
      if (gameState.activeRow === 5) {
        newGameState = {
          ...gameState,
          board,
          status: "game-over",
        };
      } else {
        newGameState = {
          ...gameState,
          board,
          status: "in-game",
          activeRow: gameState.activeRow + 1,
          activeColumn: 0,
        };
      }

      setItem("gameState", JSON.stringify(newGameState));
      setGameState(newGameState);
    }
  };

  return {
    gameState,
    gameError,
    setValue,
    loadGame,
    restartGame,
    onAnswer,
  };
}
