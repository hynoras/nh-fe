import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKey } from "consts/query-key"
import {
  createPermissionGroupApi,
  deletePermissionGroupApi,
  getPermissionGroupDetailApi,
  getPermissionGroupListApi,
  getPermissionListApi,
  updatePermissionGroupApi
} from "services/permission"
import {
  CreatePermissionGroupDto,
  UpdatePermissionGroupDto
} from "../../app/(protected)/user-and-access/role/_domain/dto/permission"
import { PermissionGroupListFilter } from "../../app/(protected)/user-and-access/role/_types/permission-group"

/**
 * Query hook for fetching permission group list
 */
export const usePermissionGroupList = (filter: PermissionGroupListFilter) => {
  return useQuery({
    queryKey: queryKey.permissionGroups(filter),
    queryFn: () => getPermissionGroupListApi(filter.search, filter.page, filter.pageSize)
  })
}

/**
 * Query hook for fetching permission group detail
 */
export const usePermissionGroupDetail = (permissionGroupId: string) => {
  return useQuery({
    queryKey: queryKey.permissionGroupDetail(permissionGroupId),
    queryFn: () => getPermissionGroupDetailApi(permissionGroupId),
    enabled: !!permissionGroupId
  })
}

/**
 * Query hook for fetching all permissions
 */
export const usePermissions = () => {
  return useQuery({
    queryKey: queryKey.permissions(),
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
      queryClient.invalidateQueries({ queryKey: queryKey.permissionGroups() })
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
      queryClient.invalidateQueries({ queryKey: queryKey.permissionGroups() })
      queryClient.invalidateQueries({
        queryKey: queryKey.permissionGroupDetail(permissionGroupId)
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
      queryClient.invalidateQueries({ queryKey: queryKey.permissionGroups() })
    }
  })
}
