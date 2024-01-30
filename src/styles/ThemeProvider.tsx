import { ThemeProvider as ShopifyThemeProvider } from "@shopify/restyle";
import { PropsWithChildren } from "react";
import { useColorScheme } from "react-native";

import { dark, light, Theme } from "./theme";

export type ThemeType = "dark" | "light" | Theme;

export type ThemeProviderProps = {
  theme?: ThemeType;
};

export function ThemeProvider({
  children,
  theme,
}: PropsWithChildren<ThemeProviderProps>) {
  const isDarkMode = useColorScheme() === "dark";
  const theme_ = theme || (isDarkMode ? "dark" : "light");
  return (
    <ShopifyThemeProvider
      theme={
        typeof theme_ === "object" ? theme_ : theme_ === "dark" ? dark : light
      }
    >
      {children}
    </ShopifyThemeProvider>
  );
}
