import {
  Permission,
  PermissionGroup
} from "app/(protected)/users-and-access/_domain/entity/permission"
import {
  permissionGroupListMapper,
  permissionGroupMapper,
  permissionListMapper
} from "app/(protected)/users-and-access/_domain/mapper/permission"
import {
  PermissionGroupModel,
  PermissionModel
} from "app/(protected)/users-and-access/_domain/model/permission"
import { permissionGroupPaths, permissionPaths } from "consts/api"
import api, { handleRequest } from "lib/api"
import { ApiResponse } from "types/response"

export const getPermissionListApi = async (): Promise<ApiResponse<Permission[]>> => {
  return await handleRequest<Permission[], PermissionModel[]>(
    api.get(permissionPaths.getList),
    permissionListMapper
  )
}

export const getPermissionGroupListApi = async (): Promise<
  ApiResponse<PermissionGroup[]>
> => {
  return await handleRequest<PermissionGroup[], PermissionGroupModel[]>(
    api.get(permissionGroupPaths.getList),
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
