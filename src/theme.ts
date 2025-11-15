"use client"
import { createTheme } from "@mui/material/styles"
import {
  primaryColorDark,
  primaryColorLight,
  secondaryColorDark,
  secondaryColorLight,
  tertiaryColorDark,
  tertiaryColorLight
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
        tertiary: { main: tertiaryColorLight }
      }
    },
    dark: {
      palette: {
        primary: { main: primaryColorDark },
        secondary: { main: secondaryColorDark },
        tertiary: { main: tertiaryColorDark }
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
