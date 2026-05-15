import { Experiment, ExperimentStatus } from "../entity/experiment"
import { ExperimentListModel, ExperimentModel } from "../model/experiment"

export const experimentListMapper = (model: ExperimentListModel[]): Experiment[] => {
  return model.map((experiment) => ({
    id: experiment.id,
    title: experiment.title,
    objective: experiment.objective,
    type: experiment.type,
    status: experiment.status as ExperimentStatus
  }))
}

export const experimentMapper = (model: ExperimentModel): Experiment => {
  return {
    id: model.id,
    title: model.title,
    objective: model.objective,
    type: model.type,
    status: model.status as ExperimentStatus,
    createdBy: model.created_by,
    createdAt: model.created_at,
    startedAt: model.started_at,
    completedAt: model.completed_at,
    version: model.version
  }
}
