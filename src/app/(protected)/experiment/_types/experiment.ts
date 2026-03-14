export type ExperimentListFilter = {
  search?: string
  page?: number
  pageSize?: number
}

export interface StatusTransitionMetadata {
  buttonText: string
  notification: {
    title: string
    message: string
  }
}
