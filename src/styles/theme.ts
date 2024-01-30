import { createTheme } from "@shopify/restyle";

import { paletteDark, paletteLight } from "./colors";
import { textVariants } from "./textVariants";

// height: 30,
//     borderRadius: 5,
//     justifyContent: "center",
//     alignItems: "center",
//     margin: 2,
//     paddingHorizontal: 10,
//     backgroundColor: "#ccc",

export const baseTheme = {
  spacing: {
    none: 0,
    xxs: 2,
    xs: 4,
    sm: 6,
    md: 8,
    xmd: 10,
    lg: 12,
    xl: 14,
    xxl: 16,
  },
  borderRadii: {
    xs: 3,
    sm: 5,
    md: 8,
    lg: 12,
    xl: 20,
    xxl: 32,
  },
  textVariants,
};

export const dark = createTheme({
  ...baseTheme,
  colors: {
    ...paletteDark,
  },
});

export const light: Theme = {
  ...baseTheme,
  colors: {
    ...paletteLight,
  },
};

export type Theme = typeof dark;
