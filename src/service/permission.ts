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
import api, { handleRequest } from "lib/api"
import { ApiResponse } from "types/response"

export const getPermissionListApi = async (): Promise<ApiResponse<Permission[]>> => {
  return await handleRequest<Permission[], PermissionModel[]>(
    api.get(permissionPaths.getList),
    permissionListMapper
  )
}

export const createPermissionGroupApi = async (
  permissionGroup: CreatePermissionGroupDto
): Promise<ApiResponse<PermissionGroup>> => {
  const response = await handleRequest<PermissionGroup, PermissionGroupModel>(
    api.post(permissionGroupPaths.create, { json: permissionGroup }),
    permissionGroupMapper
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}

export const getPermissionGroupListApi = async (
  search: string,
  page: number,
  pageSize: number
): Promise<ApiResponse<PermissionGroup[]>> => {
  return await handleRequest<PermissionGroup[], PermissionGroupModel[]>(
    api.get(permissionGroupPaths.getList(search, page, pageSize)),
    permissionGroupListMapper
  )
}

export const getPermissionGroupDetailApi = async (
  permissionGroupId: string
): Promise<ApiResponse<PermissionGroup>> => {
  return await handleRequest<PermissionGroup, PermissionGroupModel>(
    api.get(permissionGroupPaths.getDetail(permissionGroupId)),
    permissionGroupMapper
  )
}

export const updatePermissionGroupApi = async (
  permissionGroupId: string,
  permissionGroup: UpdatePermissionGroupDto
): Promise<ApiResponse<PermissionGroup>> => {
  const response = await handleRequest<PermissionGroup, PermissionGroupModel>(
    api.put(permissionGroupPaths.update(permissionGroupId), { json: permissionGroup }),
    permissionGroupMapper
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}

export const deletePermissionGroupApi = async (
  permissionGroupId: string
): Promise<ApiResponse<boolean>> => {
  const response = await handleRequest(
    api.delete(permissionGroupPaths.delete(permissionGroupId)),
    (data: any) => data
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}
