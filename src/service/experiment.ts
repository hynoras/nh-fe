import {
  CreateExperimentDto,
  UpdateExperimentDto,
  UpdateExperimentStatusDto
} from "app/(protected)/experiment/_domain/dto/experiment"
import { Experiment } from "app/(protected)/experiment/_domain/entity/experiment"
import {
  experimentListMapper,
  experimentMapper
} from "app/(protected)/experiment/_domain/mapper/experiment"
import {
  ExperimentListModel,
  ExperimentModel
} from "app/(protected)/experiment/_domain/model/experiment"
import { experimentPaths } from "consts/api"
import api, { handleRequest } from "lib/api"
import { ApiResponse } from "types/response"

export const getExperimentListApi = async (
  search: string,
  page: number,
  pageSize: number
): Promise<ApiResponse<Experiment[]>> => {
  return await handleRequest<Experiment[], ExperimentListModel[]>(
    api.get(experimentPaths.getList(search, page, pageSize)),
    experimentListMapper
  )
}

export const getExperimentDetailApi = async (
  experimentId: string
): Promise<ApiResponse<Experiment>> => {
  return await handleRequest<Experiment, ExperimentModel>(
    api.get(experimentPaths.getDetail(experimentId)),
    experimentMapper
  )
}

export const createExperimentApi = async (
  experiment: CreateExperimentDto
): Promise<ApiResponse<Experiment>> => {
  const response = await handleRequest<Experiment, ExperimentModel>(
    api.post(experimentPaths.create, { json: experiment }),
    (data: any) => data
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}

export const updateExperimentApi = async (
  experimentId: string,
  experiment: UpdateExperimentDto
): Promise<ApiResponse<Experiment>> => {
  const response = await handleRequest<Experiment, ExperimentModel>(
    api.put(experimentPaths.update(experimentId), { json: experiment }),
    (data: any) => data
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}

export const updateExperimentStatusApi = async (
  experimentId: string,
  status: UpdateExperimentStatusDto
): Promise<ApiResponse<Experiment>> => {
  const response = await handleRequest<Experiment, ExperimentModel>(
    api.put(experimentPaths.updateStatus(experimentId), { json: status }),
    (data: any) => data
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}

export const deleteExperimentApi = async (
  experimentId: string
): Promise<ApiResponse<Experiment>> => {
  const response = await handleRequest<Experiment, ExperimentModel>(
    api.delete(experimentPaths.delete(experimentId)),
    (data: any) => data
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}
