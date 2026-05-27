"use client"

import { Box, Toolbar } from "@mui/material"
import { Authenticated } from "@refinedev/core"
import Header from "components/Header"
import GlobalNotification from "components/feedback/GlobalNotification"
import Sidebar from "components/layout/Sidebar"
import { themePalette } from "constants/color"
import CreateExperiment from "features/experiment/components/CreateExperiment"
import { useState } from "react"

const DRAWER_WIDTH = 200
const COLLAPSED_WIDTH = 64

export default function ProtectedLayoutClient({
  children
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)

  return (
    <Authenticated key="authenticated-routes" redirectOnFail="/login">
      <GlobalNotification />
      <CreateExperiment />
      <Box>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Box sx={{ display: "flex", width: "100%", overflow: "hidden" }}>
          <Sidebar
            open={sidebarOpen}
            drawerWidth={DRAWER_WIDTH}
            collapsedWidth={COLLAPSED_WIDTH}
          />
          <Box
            sx={[
              {
                flexGrow: 1,
                height: "100vh",
                p: 2,
                width: "100%",
                maxWidth: "100%",
                overflowY: "hidden"
              },
              (theme) => ({
                transition: theme.transitions.create(["margin", "width"], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen
                }),
                ...theme.applyStyles("light", {
                  backgroundColor: themePalette.light.background.canvas
                }),
                ...theme.applyStyles("dark", {
                  backgroundColor: themePalette.dark.background.canvas
                })
              })
            ]}
          >
            <Toolbar className="min-h-[50px]" />
            <Box sx={{ width: "100%", overflow: "hidden" }}>{children}</Box>
          </Box>
        </Box>
      </Box>
    </Authenticated>
  )
}
