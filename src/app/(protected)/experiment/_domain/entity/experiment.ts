export enum ExperimentStatus {
  DRAFT = "draft",
  PLANNING = "planning",
  RUNNING = "running",
  COMPLETED = "completed",
  ABORTED = "aborted"
}

export type Experiment = {
  id?: string
  title?: string
  objective?: string
  status?: ExperimentStatus
  type?: string
  createdBy?: string
  createdAt?: string
  updatedAt?: string
  startedAt?: string
  completedAt?: string
}
