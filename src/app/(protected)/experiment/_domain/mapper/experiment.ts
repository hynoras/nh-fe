import { ExperimentListModel, ExperimentModel } from "../model/experiment"
import { Experiment } from "../entity/experiment"

export const experimentListMapper = (model: ExperimentListModel[]): Experiment[] => {
  return model.map((experiment) => ({
    id: experiment.id,
    title: experiment.title,
    objective: experiment.objective,
    status: experiment.status,
    createdBy: experiment.created_by,
    createdAt: experiment.created_at
  }))
}

export const experimentMapper = (model: ExperimentModel): Experiment => {
  return {
    id: model.id,
    title: model.title,
    objective: model.objective,
    status: model.status,
    createdBy: model.created_by,
    createdAt: model.created_at
  }
}
