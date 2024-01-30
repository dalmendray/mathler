export type Palette = {
  background: string;

  buttonBackground: string;
  buttonCorrect: string;
  buttonWrongPosition: string;

  textPrimary: string;
  textSecondary: string;

  cellBorder: string;

  linkPrimary: string;

  black: string;
  white: string;
  red: string;
  transparent: string;

  warning: string;

  error: string;
};

export const paletteBase = {
  black: "black",
  white: "white",
  red: "red",
  warning: "#F46565",
  error: "#D85252",
  transparent: "transparent",
};

export const paletteLight: Palette = {
  background: "white",

  buttonBackground: "#ccc",
  buttonCorrect: "#22c55d",
  buttonWrongPosition: "#ebb305",

  textPrimary: "#131417",
  textSecondary: "#646D7A",

  cellBorder: "#ccc",

  linkPrimary: "#3385FF",

  ...paletteBase,
};

export const paletteDark: Palette = {
  background: "#131417",

  buttonBackground: "#94a3b8",
  buttonCorrect: "#22c55d",
  buttonWrongPosition: "#ebb305",

  textPrimary: "white",
  textSecondary: "#646D7A",

  cellBorder: "white",

  linkPrimary: "#3385FF",

  ...paletteBase,
};
