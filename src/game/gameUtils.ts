import { CELLS_PER_ROW } from "./constants";
import { GameState, Level } from "./types";

const OPERATORS = ["+", "-", "*", "/"];
const OPERATORS_LENGTH = OPERATORS.length;

/**
 * Generates a new game
 */
export function generateGame(customEquation?: string): GameState {
  const equation = customEquation
    ? {
        equation: customEquation,
        result: evaluateArithmeticEquation(customEquation),
      }
    : generateMathEquation("medium");

  const board = Array.from({ length: 6 }, () =>
    Array(6).fill({
      value: "",
      status: "empty",
    })
  );
  return {
    board,
    equation: equation.equation,
    result: equation.result,
    status: "in-game",
    activeRow: 0,
    activeColumn: 0,
  };
}

export function evaluateArithmeticEquation(s: string): number {
  const stack = [];
  let sign = "+";
  let num = 0;

  for (let i = 0; i < s.length; i++) {
    const c = s.charAt(i);

    if (c >= "0" && c <= "9") {
      num = num * 10 + parseInt(c, 10);
    } else if (!OPERATORS.includes(c)) {
      throw new Error("Invalid equation format");
    }

    if (
      i + 1 === s.length ||
      c === "+" ||
      c === "-" ||
      c === "*" ||
      c === "/"
    ) {
      if (sign === "+") {
        stack.push(num);
      } else if (sign === "-") {
        stack.push(-num);
      } else if (sign === "*") {
        stack[stack.length - 1] = stack[stack.length - 1] * num;
      } else if (sign === "/") {
        if (num === 0) {
          throw new Error("Division by zero is not allowed");
        }
        stack[stack.length - 1] = stack[stack.length - 1] / num;
      }

      sign = c;
      num = 0;
    }
  }

  return stack.reduce((acc, curr) => acc + curr, 0);
}

export function getValueCountMap(equation: string) {
  const valueCount = {};

  for (const char of equation) {
    if (valueCount[char]) {
      valueCount[char]++;
    } else {
      valueCount[char] = 1;
    }
  }

  return valueCount;
}

export function moveNext(rowIndex: number, colIndex: number, value: string) {
  let newRow: number = rowIndex;
  let newColumn: number = colIndex;
  if (value === "") {
    if (colIndex > 0) {
      newRow = rowIndex;
      newColumn = colIndex - 1;
    }
  } else if (value.length === 1) {
    if (colIndex < 5) {
      newRow = rowIndex;
      newColumn = colIndex + 1;
    }
  }

  return { newRow, newColumn };
}

/**
 * Generate a random equation of length 6 with 2 operands and 1 operators
 *
 * Valid operators: +, -, *, /
 * 1 operand will have 3-4 digits
 * 1 operand will have 2-1 digits
 */
function generateEasyLevelEquation() {
  const operator = OPERATORS[Math.floor(Math.random() * OPERATORS_LENGTH)];
  let equation = "";
  let result = 0;

  const operand1 = generateRandomNumber(10, 9999);

  const digits = countDigits(operand1);

  const operand2 = generateRandomNumberWithLength(CELLS_PER_ROW - digits - 1);

  switch (operator) {
    case "/": {
      const { dividend, divisor } = fiftyFiftyOdds()
        ? generateFullDivisionNumbers(4, 1)
        : generateFullDivisionNumbers(3, 2);
      equation = dividend + "/" + divisor;
      result = dividend / divisor;
      return { equation, result };
    }
    case "-": {
      const max = Math.max(operand1, operand2);
      const min = Math.min(operand1, operand2);
      equation = max + "-" + min;
      result = max - min;
      return { equation, result };
    }
    case "+":
      equation = operand1 + "+" + operand2;
      result = operand1 + operand2;
      return { equation, result };
    case "*":
      equation = operand1 + "*" + operand2;
      result = operand1 * operand2;
      return { equation, result };
  }

  return { equation, result };
}

/**
 * Generate a random equation with 3 operands and 2 operators
 *
 * Valid operators: +, -, *, /
 * 1 operand will have 2 digits
 * 2 operands will have 1 digits
 */
function generateMedLevelEquation() {
  const operator1 = OPERATORS[Math.floor(Math.random() * OPERATORS_LENGTH)];
  const operator2 = OPERATORS[Math.floor(Math.random() * OPERATORS_LENGTH)];
  let equation = "";
  let result = 0;

  let operand1: number;
  let operand2: number;
  let operand3: number;

  if (operator1 === "/" && operator2 === "/") {
    operand1 = generateRandomNumber(10, 99);
    operand2 = findDivisorOfLength(operand1, 1);
    equation = operand1 + "/" + operand2;
    result = operand1 / operand2;

    operand3 = findDivisorOfLength(result, 1);

    equation = equation + "/" + operand3;
    result = result / operand3;
    return { equation, result };
  } else if (operator1 === "-" && operator2 === "/") {
    operand1 = generateRandomNumber(10, 99);
    operand2 = generateRandomNumber(0, Math.min(operand1, 9));
    operand3 = findDivisorOfLength(operand2, 1);

    equation = operand1 + "-" + operand2 + "/" + operand3;
    result = operand1 - operand2 / operand3;

    return { equation, result };
  } else if (operator1 === "/" && operator2 !== "-") {
    operand1 = generateRandomNumber(10, 99);
    operand2 = findDivisorOfLength(operand1, 1);
    operand3 = generateRandomNumber(0, operand2);

    equation = operand1 + "/" + operand2 + "-" + operand3;
    result = operand1 / operand2 - operand3;

    return { equation, result };
  } else if (operator1 === "-" && operator2 === "*") {
    operand2 = generateRandomNumber(0, 9);
    operand3 = generateRandomNumber(0, 9);

    result = operand2 * operand3;

    operand1 = generateRandomNumber(Math.max(result, 10), 99);

    equation = operand1 + "-" + operand2 + "*" + operand3;
    result = operand1 - result;

    return { equation, result };
  } else if (operator1 === "-" && operator2 === "-") {
    operand1 = generateRandomNumber(10, 99);
    operand2 = generateRandomNumber(0, Math.min(operand1, 9));

    equation = operand1 + "-" + operand2;
    result = operand1 - operand2;

    operand3 = generateRandomNumber(0, Math.min(result, 9));

    result = result - operand3;
    equation = equation + "-" + operand3;
    return { equation, result };
  } else if (operator2 === "-") {
    operand2 = generateRandomNumber(10, 99);
    operand3 = generateRandomNumber(0, Math.min(operand2, 9));

    operand1 = generateRandomNumber(0, 9);

    if (operator1 === "+") {
      equation = operand1 + "+" + operand2 + "-" + operand3;
      result = operand1 + operand2 - operand3;
    } else {
      equation = operand1 + "*" + operand2 + "-" + operand3;
      result = operand1 * operand2 - operand3;
    }

    return { equation, result };
  } else if (operator2 === "/") {
    operand2 = generateRandomNumber(10, 99);
    operand3 = findDivisorOfLength(operand2, 1);

    operand1 = generateRandomNumber(0, 9);

    if (operator1 === "+") {
      equation = operand1 + "+" + operand2 + "/" + operand3;
      result = operand1 + operand2 / operand3;
    } else {
      equation = operand1 + "*" + operand2 + "/" + operand3;
      result = (operand1 * operand2) / operand3;
    }

    return { equation, result };
  }

  switch (operator1) {
    case "/":
      operand1 = generateRandomNumber(10, 99);
      operand2 = findDivisorOfLength(operand1, 1);
      equation = operand1 + "/" + operand2;
      result = operand1 / operand2;
      break;
    case "-":
      operand1 = generateRandomNumber(10, 99);
      operand2 = generateRandomNumber(0, Math.min(operand1, 9));
      equation = operand1 + "-" + operand2;
      result = operand1 - operand2;
      break;
    case "+":
      operand1 = generateRandomNumber(0, 99);
      operand2 = generateRandomNumber(0, 9);
      equation = operand1 + "+" + operand2;
      result = operand1 + operand2;
      break;
    case "*":
      operand1 = generateRandomNumber(0, 99);
      operand2 = generateRandomNumber(0, 9);
      equation = operand1 + "*" + operand2;
      result = operand1 * operand2;
      break;
  }

  switch (operator2) {
    case "+":
      operand3 = generateRandomNumber(
        equation.length === 3 ? 10 : 0,
        equation.length === 3 ? 99 : 9
      );
      equation = equation + "+" + operand3;
      return { equation, result: evaluateArithmeticEquation(equation) };
    case "*":
      operand3 = generateRandomNumber(
        equation.length === 3 ? 10 : 0,
        equation.length === 3 ? 99 : 9
      );
      equation = equation + "*" + operand3;
      return { equation, result: evaluateArithmeticEquation(equation) };
  }
}

/**
 * Generate a random number with specified length
 *
 * @param length Length of the number. Needs to be between 0 and 15 (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)
 * @param maxValue Maximum value of the number. If not specified, the maximum value will be 10^length - 1
 * @returns A random number with specified length
 */
function generateRandomNumberWithLength(
  length: number,
  maxValue?: number
): number {
  if (length <= 0 || length > 15) {
    throw new Error("Invalid length. Length should be between 1 and 15");
  }

  if (maxValue > 10 ** length - 1) {
    throw new Error(
      "Invalid max value. Max value should be less than 10^length - 1"
    );
  }

  const min = 10 ** (length - 1); // Minimum value with specified length
  const max = maxValue !== undefined ? maxValue : 10 ** length - 1; // Maximum value with specified length
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMathEquation(level?: Level) {
  const randomLevel = level ? level : fiftyFiftyOdds() ? "easy" : "medium";

  if (randomLevel === "easy") {
    return generateEasyLevelEquation();
  }

  return generateMedLevelEquation();
}

function countDigits(n: number) {
  if (n === 0) {
    return 1; // Special case: 0 has 1 digit
  }

  // Use the base-10 logarithm to find the number of digits
  const digitCount = Math.floor(Math.log10(Math.abs(n))) + 1;

  return digitCount;
}

function generateFullDivisionNumbers(dividendDigits, divisorDigits) {
  const minDivisor = Math.pow(10, divisorDigits - 1);
  const maxDivisor = Math.pow(10, divisorDigits) - 1;
  const divisor =
    Math.floor(Math.random() * (maxDivisor - minDivisor + 1)) + minDivisor;

  let multiplier = Math.floor(Math.random() * 9) + 1; // Ensuring at least 1 digit
  let dividend = divisor * multiplier;

  const add = dividend.toString().length > dividendDigits ? -1 : 1;

  do {
    multiplier = multiplier + add;
    dividend = divisor * multiplier;
  } while (dividend.toString().length !== dividendDigits);

  return { dividend, divisor };
}

function fiftyFiftyOdds() {
  const rand = Math.random();
  return rand < 0.5;
}

function findDivisorOfLength(dividend: number, length: number) {
  if (length <= 0) {
    throw new Error("Length must be a positive integer.");
  }

  if (dividend === 0) {
    return 1;
  }

  let divisor = Math.pow(10, length) - 1; // Initialize with the biggest possible divisor

  if (divisor === 0) {
    return 1;
  }

  while (dividend % divisor !== 0) {
    divisor--;
  }

  if (divisor === 0) {
    throw new Error("No divisor found");
  }

  return divisor;
}
