"use client"
import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: "#3f0087"
    }
    // secondary: {
    //   main: "rgb(229, 229, 234)"
    // }
  },
  typography: {
    fontFamily: "var(--font-roboto)"
  }
})

export default theme
