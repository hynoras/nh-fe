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
import { handleRequest } from "lib/handleRequest"
import { clientHttp } from "lib/http.client"
import { ApiResponse } from "types/response"
import type { KyInstance } from "ky"

export const getExperimentListApi = async (
  search: string,
  page: number,
  pageSize: number,
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<Experiment[]>> => {
  return await handleRequest<Experiment[], ExperimentListModel[]>(
    httpClient.get(experimentPaths.getList(search, page, pageSize)),
    experimentListMapper
  )
}

export const getExperimentDetailApi = async (
  experimentId: string,
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<Experiment>> => {
  return await handleRequest<Experiment, ExperimentModel>(
    httpClient.get(experimentPaths.getDetail(experimentId)),
    experimentMapper
  )
}

export const createExperimentApi = async (
  experiment: CreateExperimentDto,
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<Experiment>> => {
  const response = await handleRequest<Experiment, ExperimentModel>(
    httpClient.post(experimentPaths.create, { json: experiment }),
    (data: any) => data
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}

export const updateExperimentApi = async (
  experimentId: string,
  experiment: UpdateExperimentDto,
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<Experiment>> => {
  const response = await handleRequest<Experiment, ExperimentModel>(
    httpClient.put(experimentPaths.update(experimentId), { json: experiment }),
    (data: any) => data
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}

export const updateExperimentStatusApi = async (
  experimentId: string,
  status: UpdateExperimentStatusDto,
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<Experiment>> => {
  const response = await handleRequest<Experiment, ExperimentModel>(
    httpClient.put(experimentPaths.updateStatus(experimentId), { json: status }),
    (data: any) => data
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}

export const deleteExperimentApi = async (
  experimentId: string,
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<Experiment>> => {
  const response = await handleRequest<Experiment, ExperimentModel>(
    httpClient.delete(experimentPaths.delete(experimentId)),
    (data: any) => data
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}
