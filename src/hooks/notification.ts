import { Severity } from "consts/component"
import { useNotificationStore } from "stores/notification"

export const useNotification = () => {
  const setNotification = useNotificationStore((state) => state.setNotification)

  const notify = (message: string, severity: Severity) => {
    setNotification(true, message, severity)
  }

  return { notify }
}
