export type CreateExperimentDto = {
  title: string
  objective: string
  type: string
}

export type UpdateExperimentDto = {
  title?: string
  objective?: string
  type?: string
}

export type UpdateExperimentStatusDto = {
  status: string
  version: number
}
