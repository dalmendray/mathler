import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, Switch } from "react-native";

import BaseButton from "./base/BaseButton";
import Box from "./base/Box";
import Text from "./base/Text";
import { CELLS_PER_ROW } from "../game/constants";
import { useGameState } from "../game/useGameState";
import { ThemeProvider } from "../styles/ThemeProvider";
import { getBorder, getCellBackground } from "../styles/utils";

const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const OPERATORS = ["+", "-", "*", "/"];

//const SCREEN_WIDTH = Dimensions.get("window").width;

export const MathlerGame = () => {
  const inputRefs = useRef<(typeof BaseButton | undefined)[][]>(
    Array.from({ length: CELLS_PER_ROW }, () =>
      Array(CELLS_PER_ROW).fill(undefined)
    )
  );

  const [isDarkMode, setIsDarkMode] = useState(false);

  const { gameState, onAnswer, setValue, gameError, restartGame } =
    useGameState();

  const [focusIndex, setFocusIndex] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (
      gameState?.activeRow !== undefined &&
      gameState?.activeColumn !== undefined
    ) {
      setFocusIndex([gameState.activeRow, gameState.activeColumn]);
    }
  }, [gameState?.activeRow, gameState?.activeColumn]);

  useEffect(() => {
    if (gameState?.status === "winner") {
      Alert.alert(
        "Winner",
        "Congratulations! You have won the game!",
        [
          {
            text: "Restart",
            onPress: () => {
              restartGame();
            },
          },
          {
            text: "Cancel",
          },
        ],
        {
          cancelable: true,
          userInterfaceStyle: "dark",
        }
      );
    } else if (gameState?.status === "game-over") {
      Alert.alert(
        "Game over",
        `The response was: ${gameState.equation}`,
        [
          {
            text: "Restart",
            onPress: () => {
              restartGame();
            },
          },
          {
            text: "Cancel",
          },
        ],
        {
          cancelable: true,
          userInterfaceStyle: "dark",
        }
      );
    }
  }, [gameState?.status]);

  const onDelete = () => {
    setValue("");
  };

  const onEnter = () => {
    onAnswer();
  };

  const onNumberPress = (index: number) => {
    const number = NUMBERS[index];

    setValue(number);
  };

  const onOperatorPress = (index: number) => {
    const operator = OPERATORS[index];

    setValue(operator);
  };

  const onRestartPress = () => {
    // Alert.alert(
    //   "Restart Game",
    //   "Are you sure you want to restart the game?",
    //   [
    //     {
    //       text: "Restart",
    //       onPress: () => {
    //         restartGame();
    //       },
    //     },
    //     {
    //       text: "Cancel",
    //     },
    //   ],
    //   {
    //     cancelable: true,
    //     userInterfaceStyle: "dark",
    //   }
    // );

    restartGame();
  };

  const toggleSwitch = () => setIsDarkMode((previousState) => !previousState);

  return (
    <ThemeProvider theme={isDarkMode ? "dark" : "light"}>
      {!gameState ? (
        <Box
          flex={1}
          justifyContent="center"
          paddingHorizontal="xxl"
          backgroundColor="background"
        >
          <Text variant="header">Creating a game...</Text>
        </Box>
      ) : (
        <Box
          flex={1}
          justifyContent="center"
          paddingHorizontal="xxl"
          backgroundColor="background"
        >
          <Text variant="header" textAlign="center">
            Mathler Game
          </Text>
          <Text variant="subHeader" textAlign="center">
            {`Find the hidden calculation that equals ${gameState.result}`}{" "}
          </Text>
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            alignContent="center"
            marginVertical="xxs"
          >
            <Box flexDirection="row" alignItems="center" marginHorizontal="xs">
              <Image
                source={require("../assets/sun.png")}
                style={{ width: 20, height: 20 }}
              />
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={toggleSwitch}
                value={isDarkMode}
              />
              <Image
                source={require("../assets/sun-off.png")}
                style={{ width: 20, height: 20 }}
              />
            </Box>
            <BaseButton
              borderRadius="sm"
              justifyContent="center"
              alignItems="center"
              margin="xxs"
              padding="xs"
              backgroundColor="buttonBackground"
              onPress={onRestartPress}
            >
              <Image
                source={require("../assets/reload.png")}
                style={{ width: 20, height: 20 }}
              />
            </BaseButton>
          </Box>
          <Box
            flexDirection="column"
            alignContent="center"
            justifyContent="center"
          >
            {gameState?.board.map((row, rowIndex) => (
              <Box
                flexDirection="row"
                key={rowIndex}
                justifyContent="space-between"
              >
                {row.map((cell, colIndex) => (
                  <BaseButton
                    ref={(ref: typeof BaseButton) =>
                      (inputRefs.current[rowIndex][colIndex] = ref)
                    }
                    key={colIndex}
                    activeOpacity={1}
                    width={50}
                    height={50}
                    borderRadius="sm"
                    justifyContent="center"
                    alignItems="center"
                    marginVertical="xxs"
                    marginLeft={
                      gameState?.board[0].length === colIndex ? "none" : "xs"
                    }
                    {...() => {
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
                    }}
                    // {...getBorder(
                    //   focusIndex[0] === rowIndex && focusIndex[1] === colIndex
                    // )}
                  >
                    <Text variant="body">{cell.value}</Text>
                  </BaseButton>
                ))}
              </Box>
            ))}
          </Box>
          <Box height={50} justifyContent="center">
            {gameError ? <Text variant="error">{gameError}</Text> : undefined}
          </Box>
          <Box flexDirection="row" justifyContent="center">
            {NUMBERS.map((cell, index) => (
              <BaseButton
                key={index}
                height={30}
                borderRadius="sm"
                justifyContent="center"
                alignItems="center"
                margin="xxs"
                paddingHorizontal="xmd"
                backgroundColor="buttonBackground"
                onPress={() => onNumberPress(index)}
              >
                <Text variant="bodySmall">{NUMBERS[index]}</Text>
              </BaseButton>
            ))}
          </Box>
          <Box flexDirection="row" justifyContent="center">
            <BaseButton
              borderRadius="sm"
              justifyContent="center"
              alignItems="center"
              margin="xxs"
              paddingHorizontal="xmd"
              backgroundColor="buttonBackground"
              onPress={onEnter}
            >
              <Text variant="bodySmall">Enter</Text>
            </BaseButton>
            {OPERATORS.map((cell, index) => (
              <BaseButton
                key={index}
                height={30}
                borderRadius="sm"
                justifyContent="center"
                alignItems="center"
                margin="xxs"
                paddingHorizontal="xmd"
                backgroundColor="buttonBackground"
                onPress={() => onOperatorPress(index)}
              >
                <Text variant="bodySmall">{OPERATORS[index]}</Text>
              </BaseButton>
            ))}
            <BaseButton
              borderRadius="sm"
              justifyContent="center"
              alignItems="center"
              margin="xxs"
              paddingHorizontal="xmd"
              backgroundColor="buttonBackground"
              onPress={onDelete}
            >
              <Text variant="bodySmall">Delete</Text>
            </BaseButton>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
};

export default MathlerGame;
