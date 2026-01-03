export type ExperimentListModel = {
  id: string
  title: string
  objective: string
  type: string
  status: string
  created_by: string
  created_at: string
}

export type ExperimentModel = {
  id: string
  title: string
  objective: string
  type: string
  status: string
  created_by: string
  created_at: string
  started_at: string
  completed_at: string
}
