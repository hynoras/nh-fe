export type { ListFilter as ExperimentListFilter } from "types/pagination"

export interface StatusTransitionMetadata {
  buttonText: string
  notification: {
    title: string
    message: string
  }
}
