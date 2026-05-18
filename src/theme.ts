"use client"
import { createTheme } from "@mui/material/styles"
import { themePalette } from "consts/color"

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
        primary: { main: themePalette.light.primary.main },
        secondary: { main: themePalette.light.secondary.main },
        tertiary: { main: themePalette.light.tertiary.main },
        error: { main: themePalette.light.error.main },
        warning: { main: themePalette.light.warning.main },
        success: { main: themePalette.light.success.main },
        info: { main: themePalette.light.info.main }
      }
    },
    dark: {
      palette: {
        primary: { main: themePalette.dark.primary.main },
        secondary: { main: themePalette.dark.secondary.main },
        tertiary: { main: themePalette.dark.tertiary.main },
        error: { main: themePalette.dark.error.main },
        warning: { main: themePalette.dark.warning.main },
        success: { main: themePalette.dark.success.main },
        info: { main: themePalette.dark.info.main }
      }
    }
  },
  cssVariables: {
    colorSchemeSelector: "class"
  },
  typography: {
    fontFamily: "var(--font-roboto)"
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          const color = ownerState.color || "primary"
          const variant = ownerState.variant || "text"
          const mode = theme.palette.mode

          if (mode === "light" && color in themePalette.light) {
            const paletteColor = themePalette.light[color as keyof typeof themePalette.light]

            if (variant === "contained") {
              return {
                "&:hover": {
                  backgroundColor: paletteColor.hover
                },
                "&:active": {
                  backgroundColor: paletteColor.active
                },
                "&.Mui-disabled": {
                  backgroundColor: paletteColor.disabled,
                  color: "#ffffff",
                  opacity: 0.7
                }
              }
            } else if (variant === "outlined") {
              return {
                "&:hover": {
                  borderColor: paletteColor.hover,
                  color: paletteColor.hover
                },
                "&.Mui-disabled": {
                  borderColor: paletteColor.disabled,
                  color: paletteColor.disabled
                }
              }
            } else {
              return {
                color: paletteColor.main,
                "&:hover": {
                  color: paletteColor.hover,
                  backgroundColor: "rgba(0, 0, 0, 0.04)"
                },
                "&.Mui-disabled": {
                  color: paletteColor.disabled
                }
              }
            }
          }
          return {}
        }
      }
    }
  }
})

export default theme
