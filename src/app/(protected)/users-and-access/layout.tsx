"use client"

import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { Box, IconButton, Stack, Tab, Tabs, Typography } from "@mui/material"
import { navigationKeys, navigationRoutes } from "consts/navigation"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
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
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())

  const tabs = ["users", "roles"]

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    params.set("tab", tabs[newValue])
    router.push(`${navigationKeys.usersAndAccess}?${params.toString()}`)
  }

  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam) {
      const tabIndex = tabs.indexOf(tabParam.toLowerCase())
      if (tabIndex !== -1) {
        setValue(tabIndex)
      } else {
        setValue(0)
        params.set("tab", "users")
      }
    } else {
      setValue(0)
      params.set("tab", "users")
    }
  }, [])

  if (pathname === navigationRoutes.usersAndAccess.createUser) {
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
