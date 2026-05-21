"use client"

import { Box, Toolbar } from "@mui/material"
import { Authenticated } from "@refinedev/core"
import Header from "components/Header"
import Sidebar from "components/layout/Sidebar"
import { useState } from "react"

const DRAWER_WIDTH = 220
const COLLAPSED_WIDTH = 64

export default function ProtectedLayoutClient({
  children
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)

  return (
    <Authenticated key="authenticated-routes" redirectOnFail="/login">
      <Box>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Box sx={{ display: "flex", width: "100%", overflow: "hidden" }}>
          <Sidebar
            open={sidebarOpen}
            drawerWidth={DRAWER_WIDTH}
            collapsedWidth={COLLAPSED_WIDTH}
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
                theme.transitions.create(["margin", "width"], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen
                })
            }}
          >
            <Toolbar className="min-h-[50px]" />
            <Box sx={{ width: "100%", overflow: "hidden" }}>{children}</Box>
          </Box>
        </Box>
      </Box>
    </Authenticated>
  )
}
