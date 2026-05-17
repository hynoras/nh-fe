import { Box, Typography } from "@mui/material"
import { checkPermissionServer } from "lib/auth/permission.server"
import { redirect } from "next/navigation"

const HomePage = async () => {
  const result = await checkPermissionServer()

  if (!result.authorized) {
    redirect("/login")
  }

  return (
    <Box textAlign="center" py={6}>
      <Typography variant="h4" mb={1}>
        Welcome back to Noheir
      </Typography>
    </Box>
  )
}

export default HomePage
