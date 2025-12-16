"use client"

import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { Box, IconButton, Stack, Tab, Tabs, Typography } from "@mui/material"
import { navigationRoutes } from "consts/navigation"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`
  }
}

export default function UsersAndAccessLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [value, setValue] = useState<number>(0)
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        router.push(navigationRoutes.userAndAccess.user.list)
        break
      case 1:
        router.push(navigationRoutes.userAndAccess.role.list)
        break
      default:
        router.push(navigationRoutes.userAndAccess.user.list)
    }
  }

  useEffect(() => {
    switch (pathname) {
      case navigationRoutes.userAndAccess.user.list:
        setValue(0)
        break
      case navigationRoutes.userAndAccess.role.list:
        setValue(1)
        break
      default:
        setValue(0)
    }
  }, [pathname])

  if (pathname === navigationRoutes.userAndAccess.user.create) {
    return (
      <Stack className="h-[82vh] overflow-y-scroll" direction="column" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={() => router.back()} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Create User</Typography>
        </Stack>
        {children}
      </Stack>
    )
  }

  return (
    <Stack direction="column">
      <Typography variant="h6">Users & Access</Typography>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="users and access tabs">
            <Tab label="Users" {...a11yProps(0)} />
            <Tab label="Roles" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <Box className="pt-4">{children}</Box>
      </Box>
    </Stack>
  )
}
