import { Severity } from "consts/component"
import { create } from "zustand"

interface NotificationState {
  open: boolean
  message: string
  severity: Severity
  setNotification: (open: boolean, message: string, severity: Severity) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  open: false,
  message: "",
  severity: "info",
  setNotification: (open, message, severity) => set({ open, message, severity })
}))
