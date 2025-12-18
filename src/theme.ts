"use client"
import { createTheme } from "@mui/material/styles"
import {
  errorColorDark,
  errorColorLight,
  infoColorDark,
  infoColorLight,
  primaryColorDark,
  primaryColorLight,
  secondaryColorDark,
  secondaryColorLight,
  successColorDark,
  successColorLight,
  tertiaryColorDark,
  tertiaryColorLight,
  warningColorDark,
  warningColorLight
} from "consts/color"

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"]
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"]
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    tertiary: true
  }
}

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: primaryColorLight },
        secondary: { main: secondaryColorLight },
        tertiary: { main: tertiaryColorLight },
        error: { main: errorColorLight },
        warning: { main: warningColorLight },
        success: { main: successColorLight },
        info: { main: infoColorLight }
      }
    },
    dark: {
      palette: {
        primary: { main: primaryColorDark },
        secondary: { main: secondaryColorDark },
        tertiary: { main: tertiaryColorDark },
        error: { main: errorColorDark },
        warning: { main: warningColorDark },
        success: { main: successColorDark },
        info: { main: infoColorDark }
      }
    }
  },
  cssVariables: {
    colorSchemeSelector: "class"
  },
  typography: {
    fontFamily: "var(--font-roboto)"
  },
  components: {}
})

export default theme
