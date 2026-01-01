import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKey } from "consts/query-key"
import {
  createExperimentApi,
  deleteExperimentApi,
  getExperimentDetailApi,
  getExperimentListApi,
  updateExperimentApi
} from "service/experiment"
import {
  CreateExperimentDto,
  UpdateExperimentDto
} from "../../app/(protected)/experiment/_domain/dto/experiment"
import { ExperimentListFilter } from "../../app/(protected)/experiment/_types/experiment"

/**
 * Query hook for fetching experiment list
 */
export const useExperimentList = (filter: ExperimentListFilter) => {
  return useQuery({
    queryKey: queryKey.experiments(filter),
    queryFn: () =>
      getExperimentListApi(filter.search || "", filter.page || 1, filter.pageSize || 10)
  })
}

/**
 * Query hook for fetching experiment detail
 */
export const useExperimentDetail = (experimentId: string) => {
  return useQuery({
    queryKey: queryKey.experimentDetail(experimentId),
    queryFn: () => getExperimentDetailApi(experimentId),
    enabled: !!experimentId
  })
}

/**
 * Mutation hook for creating an experiment
 */
export const useCreateExperiment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (experiment: CreateExperimentDto) => createExperimentApi(experiment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.experiments() })
    }
  })
}

/**
 * Mutation hook for updating an experiment
 */
export const useUpdateExperiment = (experimentId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (experiment: UpdateExperimentDto) =>
      updateExperimentApi(experimentId, experiment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.experiments() })
      queryClient.invalidateQueries({
        queryKey: queryKey.experimentDetail(experimentId)
      })
    }
  })
}

/**
 * Mutation hook for deleting an experiment
 */
export const useDeleteExperiment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (experimentId: string) => deleteExperimentApi(experimentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.experiments() })
    }
  })
}
