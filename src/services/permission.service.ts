import { permissionGroupPaths, permissionPaths } from "consts/api"
import {
  CreatePermissionGroupDto,
  UpdatePermissionGroupDto
} from "domain/permission/permission.dto"
import { Permission, PermissionGroup } from "domain/permission/permission.entity"
import {
  permissionGroupListMapper,
  permissionGroupMapper,
  permissionListMapper
} from "domain/permission/permission.mapper"
import { PermissionGroupModel, PermissionModel } from "domain/permission/permission.model"
import { KyInstance } from "ky"
import { httpClient } from "lib/api/http.client"
import { handleRequest } from "lib/api/request"
import { ApiResponse } from "types/response"

export const getPermissionListApi = async (
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<Permission[]>> => {
  return await handleRequest<Permission[], PermissionModel[]>(
    apiClient.get(permissionPaths.getList),
    permissionListMapper
  )
}

export const createPermissionGroupApi = async (
  permissionGroup: CreatePermissionGroupDto,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<PermissionGroup>> => {
  return handleRequest<PermissionGroup, PermissionGroupModel>(
    apiClient.post(permissionGroupPaths.create, { json: permissionGroup }),
    permissionGroupMapper
  )
}

export const getPermissionGroupListApi = async (
  search: string = "",
  page: number = 1,
  pageSize: number = 10,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<PermissionGroup[]>> => {
  return await handleRequest<PermissionGroup[], PermissionGroupModel[]>(
    apiClient.get(permissionGroupPaths.getList(search, page, pageSize)),
    permissionGroupListMapper
  )
}

export const getPermissionGroupDetailApi = async (
  permissionGroupId: string,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<PermissionGroup>> => {
  return await handleRequest<PermissionGroup, PermissionGroupModel>(
    apiClient.get(permissionGroupPaths.getDetail(permissionGroupId)),
    permissionGroupMapper
  )
}

export const updatePermissionGroupApi = async (
  permissionGroupId: string,
  permissionGroup: UpdatePermissionGroupDto,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<PermissionGroup>> => {
  return handleRequest<PermissionGroup, PermissionGroupModel>(
    apiClient.put(permissionGroupPaths.update(permissionGroupId), {
      json: permissionGroup
    }),
    permissionGroupMapper
  )
}

export const deletePermissionGroupApi = async (
  permissionGroupId: string,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<boolean>> => {
  return handleRequest(
    apiClient.delete(permissionGroupPaths.delete(permissionGroupId)),
    (data: any) => data
  )
}
