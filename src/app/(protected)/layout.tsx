"use client"

import { Box, Toolbar } from "@mui/material"
import { Authenticated } from "@refinedev/core"
import Header from "components/Header"
import Sidebar from "components/Sidebar"
import { useState } from "react"

const DRAWER_WIDTH = 200

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  return (
    <Authenticated key="authenticated-routes">
      <Box sx={{ display: "flex" }}>
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          drawerWidth={DRAWER_WIDTH}
        />
        <Sidebar open={sidebarOpen} drawerWidth={DRAWER_WIDTH} />
        <Box
          sx={{
            flexGrow: 1,
            p: 1,
            transition: (theme) =>
              theme.transitions.create(["margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
              }),
            marginLeft: sidebarOpen ? 0 : `-${DRAWER_WIDTH}px`
          }}
        >
          <Toolbar sx={{ minHeight: 50, height: 50 }} />
          {children}
        </Box>
      </Box>
    </Authenticated>
  )
}
