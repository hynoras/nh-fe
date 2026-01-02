import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKey } from "consts/query-key"
import { getPermissionGroupListApi } from "service/permission"
import {
  createUserApi,
  deleteUserApi,
  getUserDetailApi,
  getUserListApi,
  updateUserApi
} from "service/user"
import {
  CreateUserDto,
  UpdateUserDto
} from "../../app/(protected)/user-and-access/user/_domain/dto/user"
import {
  PermissionGroupListFilter,
  UserListFilter
} from "../../app/(protected)/user-and-access/user/_types/user"

/**
 * Query hook for fetching user list
 */
export const useUserList = (filter: UserListFilter) => {
  return useQuery({
    queryKey: queryKey.users(filter),
    queryFn: () =>
      getUserListApi(filter.search || "", filter.page || 1, filter.pageSize || 10)
  })
}

/**
 * Query hook for fetching user detail
 */
export const useUserDetail = (userId: string) => {
  return useQuery({
    queryKey: queryKey.userDetail(userId),
    queryFn: () => getUserDetailApi(userId)
  })
}

/**
 * Mutation hook for creating a user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (user: CreateUserDto) => createUserApi(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.users() })
    }
  })
}

/**
 * Mutation hook for updating a user
 */
export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (user: UpdateUserDto) => updateUserApi(userId, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.userDetail(userId) })
      queryClient.invalidateQueries({ queryKey: queryKey.users() })
    }
  })
}

/**
 * Mutation hook for deleting users
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userIds: string[]) => deleteUserApi(userIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey.users() })
    }
  })
}

/**
 * Query hook for fetching permission groups (used in user pages)
 */
export const usePermissionGroups = (filter: PermissionGroupListFilter) => {
  return useQuery({
    queryKey: queryKey.permissionGroups(filter),
    queryFn: () =>
      getPermissionGroupListApi(
        filter.search || "",
        filter.page || 1,
        filter.pageSize || 10
      )
  })
}
