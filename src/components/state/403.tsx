import { LockOutlined } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"

type ForbiddenPageProps = {
  icon?: React.ReactNode
  title?: string
  description?: string
}

const ForbiddenPage = (props: ForbiddenPageProps) => {
  return (
    <Box className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-2">
      {props.icon || <LockOutlined fontSize="large" color="warning" />}
      <Typography variant="h4">{props.title || "403"}</Typography>
      <Typography color="text.secondary">
        {props.description || "You are not authorized to access this page."}
      </Typography>
    </Box>
  )
}

export default ForbiddenPage
