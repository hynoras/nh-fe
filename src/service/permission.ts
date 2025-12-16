import {
  Permission,
  PermissionGroup
} from "app/(protected)/user-and-access/user/_domain/entity/permission"
import {
  permissionGroupListMapper,
  permissionGroupMapper,
  permissionListMapper
} from "app/(protected)/user-and-access/user/_domain/mapper/permission"
import {
  PermissionGroupModel,
  PermissionModel
} from "app/(protected)/user-and-access/user/_domain/model/permission"
import { permissionGroupPaths, permissionPaths } from "consts/api"
import api, { handleRequest } from "lib/api"
import { ApiResponse } from "types/response"

export const getPermissionListApi = async (): Promise<ApiResponse<Permission[]>> => {
  return await handleRequest<Permission[], PermissionModel[]>(
    api.get(permissionPaths.getList),
    permissionListMapper
  )
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
