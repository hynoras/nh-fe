import { Box, Typography } from "@mui/material"
import { redirect } from "next/navigation"
import { checkPermissionServer } from "service/permission.server"

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
