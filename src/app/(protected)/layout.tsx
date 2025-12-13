"use client"

import { Box, Toolbar } from "@mui/material"
import { Authenticated } from "@refinedev/core"
import Header from "components/Header"
import Sidebar from "components/Sidebar"
import { useState } from "react"

const DRAWER_WIDTH = 220

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  return (
    <Authenticated key="authenticated-routes" redirectOnFail="/login">
      <Box sx={{ display: "flex", width: "100%", overflow: "hidden" }}>
        <Sidebar open={sidebarOpen} drawerWidth={DRAWER_WIDTH} />
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          drawerWidth={DRAWER_WIDTH}
        />
        <Box
          sx={{
            flexGrow: 1,
            height: "99vh",
            p: 2,
            mb: "6px",
            width: "100%",
            maxWidth: "100%",
            overflowY: "hidden",
            borderRadius: 2,
            transition: (theme) =>
              theme.transitions.create(["margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
              }),
            marginLeft: sidebarOpen ? 0 : `-${DRAWER_WIDTH}px`
          }}
        >
          <Toolbar />
          <Box sx={{ width: "100%", overflow: "hidden" }}>{children}</Box>
        </Box>
      </Box>
    </Authenticated>
  )
}
