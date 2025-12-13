"use client"

import { Box, Stack, Tab, Tabs, Typography } from "@mui/material"
import { navigationKeys } from "consts/navigation"
import { useRouter, useSearchParams } from "next/navigation"
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
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())

  const tabs = ["users", "roles"]

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const tabValue = tabs[newValue]
    params.set("tab", tabValue)
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
        router.replace(`${navigationKeys.usersAndAccess}?${params.toString()}`)
      }
    } else {
      setValue(0)
      params.set("tab", "users")
      router.replace(`${navigationKeys.usersAndAccess}?${params.toString()}`)
    }
  }, [searchParams, router])

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
        <Box sx={{ pt: 3 }}>{children}</Box>
      </Box>
    </Stack>
  )
}
