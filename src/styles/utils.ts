import { Cell } from "../game/types";

export function getCellBackground(cell: Cell) {
  switch (cell.status) {
    case "correct":
      return { backgroundColor: "buttonCorrect" };
    case "not-in-equation":
      return { backgroundColor: "buttonBackground" };
    case "empty":
      return {
        borderColor: "cellBorder",
        borderWidth: 1,
      };
    case "wrong-position":
      return {
        backgroundColor: "buttonWrongPosition",
      };
    default:
      return {};
  }
}
