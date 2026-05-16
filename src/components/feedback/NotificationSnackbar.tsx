import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"

export type NotificationProps = {
  open: boolean
  onClose: () => void
  message: string
  severity: "success" | "error" | "warning" | "info"
}

const NotificationSnackbar = ({
  open,
  onClose,
  message,
  severity
}: NotificationProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="standard"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default NotificationSnackbar
