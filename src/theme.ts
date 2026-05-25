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
          default: themePalette.light.background.canvas,
          paper: themePalette.light.background.surface
        },
        text: {
          primary: themePalette.light.typography.body1.color,
          secondary: themePalette.light.typography.body2.color,
          disabled: themePalette.light.typography.caption.color
        },
        // divider: themePalette.light.divider,
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
          default: themePalette.dark.background.canvas,
          paper: themePalette.dark.background.surface
        },
        text: {
          primary: themePalette.dark.typography.body1.color,
          secondary: themePalette.dark.typography.body2.color,
          disabled: themePalette.dark.typography.caption.color
        },
        // divider: themePalette.dark.divider,
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
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.applyStyles("light", {
            backgroundColor: themePalette.light.background.surface,
            borderBottom: `1px solid ${themePalette.light.borders.subtle}`,
            boxShadow: "none"
          }),
          ...theme.applyStyles("dark", {
            backgroundColor: themePalette.dark.background.surface,
            borderBottom: `1px solid ${themePalette.dark.borders.subtle}`,
            boxShadow: "none"
          })
        })
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          ...theme.applyStyles("light", {
            backgroundColor: themePalette.light.background.surface,
            borderRight: `1px solid ${themePalette.light.borders.subtle}`
          }),
          ...theme.applyStyles("dark", {
            backgroundColor: themePalette.dark.background.surface,
            borderRight: `1px solid ${themePalette.dark.borders.subtle}`
          })
        })
      }
    },
    // MuiDivider: {
    //   styleOverrides: {
    //     root: ({ theme }) => ({
    //       ...theme.applyStyles("light", {
    //         borderColor: themePalette.light.divider
    //       }),
    //       ...theme.applyStyles("dark", {
    //         borderColor: themePalette.dark.divider
    //       })
    //     })
    //   }
    // },
    MuiTypography: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          // Skip custom typography colors when an explicit color is set
          // (e.g. via color prop or sx={{ color: ... }})
          if (ownerState.color && ownerState.color !== "initial") {
            return {}
          }

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
            backgroundColor: themePalette.dark.background.card,
            border: `1px solid ${themePalette.dark.borders.subtle}`,
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.35)"
          }),
          ...theme.applyStyles("light", {
            backgroundColor: themePalette.light.background.card,
            border: `1px solid ${themePalette.light.borders.subtle}`,
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
    },
    MuiPopover: {
      styleOverrides: {
        paper: ({ theme }) => ({
          ...theme.applyStyles("light", {
            backgroundColor: themePalette.light.background.popover,
            border: `1px solid ${themePalette.light.borders.subtle}`
          }),
          ...theme.applyStyles("dark", {
            backgroundColor: themePalette.dark.background.popover,
            border: `1px solid ${themePalette.dark.borders.subtle}`
          })
        })
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderLeft: "3px solid transparent",
          ...theme.applyStyles("light", {
            color: themePalette.light.navigation.textIdle,
            "&:hover": {
              backgroundColor: themePalette.light.background.canvas,
              color: themePalette.light.navigation.textHover
            },
            "&.Mui-selected": {
              backgroundColor: "rgba(63, 0, 135, 0.08)",
              color: themePalette.light.navigation.textActive,
              borderLeftColor: themePalette.light.navigation.accentBar,
              "&:hover": {
                backgroundColor: "rgba(63, 0, 135, 0.12)"
              }
            }
          }),
          ...theme.applyStyles("dark", {
            color: themePalette.dark.navigation.textIdle,
            "&:hover": {
              backgroundColor: themePalette.dark.background.canvas,
              color: themePalette.dark.navigation.textHover
            },
            "&.Mui-selected": {
              backgroundColor: "rgba(109, 94, 246, 0.08)",
              color: themePalette.dark.navigation.textActive,
              borderLeftColor: themePalette.dark.navigation.accentBar,
              "&:hover": {
                backgroundColor: "rgba(109, 94, 246, 0.12)"
              }
            }
          })
        })
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "inherit"
        }
      }
    }
  }
})

export default theme
