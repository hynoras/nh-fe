"use client"
import { Box, Tab, Tabs } from "@mui/material"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`
  }
}

export default function SettingLayout({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<number>(0)
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        router.push("/setting/profile")
        break
      case 1:
        router.push("/setting/preferences")
        break
      default:
        router.push("/setting/profile")
    }
  }

  useEffect(() => {
    switch (pathname) {
      case "/setting/profile":
        setValue(0)
        break
      case "/setting/preferences":
        setValue(1)
        break
      default:
        setValue(0)
    }
  }, [pathname])

  return (
    <Stack className="overflow-y-hidden" direction={"column"} spacing={2}>
      <Typography variant="h4">Settings</Typography>
      <Typography variant="body2">Managing your settings and preferences</Typography>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="settings tabs">
            <Tab label="Profile" {...a11yProps(0)} />
            <Tab label="Preferences" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <Box sx={{ pt: 3 }}>{children}</Box>
      </Box>
    </Stack>
  )
}
