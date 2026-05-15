"use client"

import { useNotificationStore } from "stores/notification"
import NotificationSnackbar from "./NotificationSnackbar"

const GlobalNotification = () => {
  const { open, message, severity, setNotification } = useNotificationStore()

  const handleClose = () => {
    setNotification(false, message, severity)
  }

  return (
    <NotificationSnackbar
      open={open}
      message={message}
      severity={severity}
      onClose={handleClose}
    />
  )
}

export default GlobalNotification
