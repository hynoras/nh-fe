import {
  CreatePermissionGroupDto,
  UpdatePermissionGroupDto
} from "app/(protected)/user-and-access/role/_domain/dto/permission"
import {
  Permission,
  PermissionGroup
} from "app/(protected)/user-and-access/role/_domain/entity/permission"
import {
  permissionGroupListMapper,
  permissionGroupMapper,
  permissionListMapper
} from "app/(protected)/user-and-access/role/_domain/mapper/permission"
import {
  PermissionGroupModel,
  PermissionModel
} from "app/(protected)/user-and-access/role/_domain/model/permission"
import { permissionGroupPaths, permissionPaths } from "consts/api"
import { handleRequest } from "lib/handleRequest"
import { clientHttp } from "lib/http.client"
import { ApiResponse } from "types/response"
import type { KyInstance } from "ky"

export const getPermissionListApi = async (
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<Permission[]>> => {
  return await handleRequest<Permission[], PermissionModel[]>(
    httpClient.get(permissionPaths.getList),
    permissionListMapper
  )
}

export const createPermissionGroupApi = async (
  permissionGroup: CreatePermissionGroupDto,
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<PermissionGroup>> => {
  const response = await handleRequest<PermissionGroup, PermissionGroupModel>(
    httpClient.post(permissionGroupPaths.create, { json: permissionGroup }),
    permissionGroupMapper
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}

export const getPermissionGroupListApi = async (
  search?: string,
  page?: number,
  pageSize?: number,
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<PermissionGroup[]>> => {
  return await handleRequest<PermissionGroup[], PermissionGroupModel[]>(
    httpClient.get(permissionGroupPaths.getList(search, page, pageSize)),
    permissionGroupListMapper
  )
}

export const getPermissionGroupDetailApi = async (
  permissionGroupId: string,
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<PermissionGroup>> => {
  return await handleRequest<PermissionGroup, PermissionGroupModel>(
    httpClient.get(permissionGroupPaths.getDetail(permissionGroupId)),
    permissionGroupMapper
  )
}

export const updatePermissionGroupApi = async (
  permissionGroupId: string,
  permissionGroup: UpdatePermissionGroupDto,
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<PermissionGroup>> => {
  const response = await handleRequest<PermissionGroup, PermissionGroupModel>(
    httpClient.put(permissionGroupPaths.update(permissionGroupId), { json: permissionGroup }),
    permissionGroupMapper
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}

export const deletePermissionGroupApi = async (
  permissionGroupId: string,
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<boolean>> => {
  const response = await handleRequest(
    httpClient.delete(permissionGroupPaths.delete(permissionGroupId)),
    (data: any) => data
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}
