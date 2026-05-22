import { create } from "zustand"

interface ModalState {
  openCreateExperiment: boolean
  setOpenCreateExperiment: (open: boolean) => void
}

export const useModalStore = create<ModalState>((set) => ({
  openCreateExperiment: false,
  setOpenCreateExperiment: (open: boolean) => set({ openCreateExperiment: open })
}))
