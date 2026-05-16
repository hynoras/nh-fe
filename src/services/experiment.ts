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
import { httpClient } from "lib/api/http.client"
import { handleRequest } from "lib/api/request"
import { KyInstance } from "ky"
import { ApiResponse } from "types/response"

export const getExperimentListApi = async (
  search: string,
  page: number,
  pageSize: number,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<Experiment[]>> => {
  return await handleRequest<Experiment[], ExperimentListModel[]>(
    apiClient.get(experimentPaths.getList(search, page, pageSize)),
    experimentListMapper
  )
}

export const getExperimentDetailApi = async (
  experimentId: string,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<Experiment>> => {
  return await handleRequest<Experiment, ExperimentModel>(
    apiClient.get(experimentPaths.getDetail(experimentId)),
    experimentMapper
  )
}

export const createExperimentApi = async (
  experiment: CreateExperimentDto,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<Experiment>> => {
  return handleRequest<Experiment, ExperimentModel>(
    apiClient.post(experimentPaths.create, { json: experiment }),
    (data: any) => data
  )
}

export const updateExperimentApi = async (
  experimentId: string,
  experiment: UpdateExperimentDto,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<Experiment>> => {
  return handleRequest<Experiment, ExperimentModel>(
    apiClient.put(experimentPaths.update(experimentId), { json: experiment }),
    (data: any) => data
  )
}

export const updateExperimentStatusApi = async (
  experimentId: string,
  status: UpdateExperimentStatusDto,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<Experiment>> => {
  return handleRequest<Experiment, ExperimentModel>(
    apiClient.put(experimentPaths.updateStatus(experimentId), { json: status }),
    (data: any) => data
  )
}

export const deleteExperimentApi = async (
  experimentId: string,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<Experiment>> => {
  return handleRequest<Experiment, ExperimentModel>(
    apiClient.delete(experimentPaths.delete(experimentId)),
    (data: any) => data
  )
}
