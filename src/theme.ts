"use client"
import { createTheme } from "@mui/material/styles"
import { themePalette } from "constants/color"

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
        background: {
          default: themePalette.light.default,
          paper: themePalette.light.default
        },
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
        background: {
          default: themePalette.dark.default,
          paper: themePalette.dark.default
        },
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
    MuiTypography: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          const variant = ownerState.variant || "body1"
          const lightTypography = themePalette.light.typography
          const darkTypography = themePalette.dark.typography

          if (variant in darkTypography) {
            const key = variant as keyof typeof darkTypography
            return {
              color: lightTypography[key].color,
              ...theme.applyStyles("dark", {
                color: darkTypography[key].color
              })
            }
          }
          return {}
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: "20px",
          ...theme.applyStyles("dark", {
            border: "1px solid rgba(255, 255, 255, 0.06)",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.35)"
          }),
          ...theme.applyStyles("light", {
            border: "1px solid rgba(0, 0, 0, 0.06)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06), 0 0 24px rgba(63, 0, 135, 0.04)"
          })
        })
      }
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          const color = ownerState.color || "primary"
          const variant = ownerState.variant || "text"
          const mode = theme.palette.mode

          const validColors = [
            "primary",
            "secondary",
            "tertiary",
            "error",
            "warning",
            "success",
            "info"
          ] as const
          const isValidColor = (col: string): col is (typeof validColors)[number] =>
            validColors.includes(col as any)

          if (mode === "light" && isValidColor(color)) {
            const paletteColor = themePalette.light[color]

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
