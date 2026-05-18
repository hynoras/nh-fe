import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKey } from "consts/query-key"
import {
  createPermissionGroupApi,
  deletePermissionGroupApi,
  getPermissionGroupDetailApi,
  getPermissionGroupListApi,
  getPermissionListApi,
  updatePermissionGroupApi
} from "services/permission.service"
import { PermissionGroupListFilter } from "../../features/role/types/permission-group"
import {
  CreatePermissionGroupDto,
  UpdatePermissionGroupDto
} from "../../domain/permission/permission.dto"

/**
 * Query hook for fetching permission group list
 */
export const usePermissionGroupList = (filter: PermissionGroupListFilter) => {
  return useQuery({
    queryKey: queryKey.permissionGroup.list(filter),
    queryFn: () => getPermissionGroupListApi(filter.search, filter.page, filter.pageSize)
  })
}

/**
 * Query hook for fetching permission group detail
 */
export const usePermissionGroupDetail = (permissionGroupId: string) => {
  return useQuery({
    queryKey: queryKey.permissionGroup.detail(permissionGroupId),
    queryFn: () => getPermissionGroupDetailApi(permissionGroupId),
    enabled: !!permissionGroupId
  })
}

/**
 * Query hook for fetching all permissions
 */
export const usePermissions = () => {
  return useQuery({
    queryKey: queryKey.permission.all,
    queryFn: () => getPermissionListApi()
  })
}

/**
 * Mutation hook for creating a permission group
 */
export const useCreatePermissionGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (permissionGroup: CreatePermissionGroupDto) =>
      createPermissionGroupApi(permissionGroup),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.permissionGroup.all })
    }
  })
}

/**
 * Mutation hook for updating a permission group
 */
export const useUpdatePermissionGroup = (permissionGroupId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (permissionGroup: UpdatePermissionGroupDto) =>
      updatePermissionGroupApi(permissionGroupId, permissionGroup),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.permissionGroup.all })
      queryClient.invalidateQueries({
        queryKey: queryKey.permissionGroup.detail(permissionGroupId)
      })
    }
  })
}

/**
 * Mutation hook for deleting a permission group
 */
export const useDeletePermissionGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (permissionGroupId: string) =>
      deletePermissionGroupApi(permissionGroupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.permissionGroup.all })
    }
  })
}
