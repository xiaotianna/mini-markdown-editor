import React, { FC } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme";

const GlobalTheme: FC<{
  children: React.ReactNode;
  theme?: "light" | "dark";
}> = ({ children, theme = "light" }) => {
  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>{children}</ThemeProvider>
  );
};

export default GlobalTheme;
