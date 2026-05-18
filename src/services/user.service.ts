import { userPaths } from "constants/api"
import { meMapper, userDetailMapper, userListMapper } from "domain/user/user.mapper"
import { KyInstance } from "ky"
import { httpClient } from "lib/api/http.client"
import { handleRequest } from "lib/api/request"
import { ApiResponse } from "types/response"
import { CreateUserDto, UpdateUserDto } from "../domain/user/user.dto"
import { User } from "../domain/user/user.entity"
import { MeModel, UserDetailModel, UserListModel } from "../domain/user/user.model"

export const getUserListApi = async (
  search: string = "",
  page: number = 1,
  pageSize: number = 10,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<User[]>> => {
  return await handleRequest<User[], UserListModel[]>(
    apiClient.get(userPaths.getList(search, page, pageSize)),
    userListMapper
  )
}

export const getMeApi = async (
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<User>> => {
  return await handleRequest<User, MeModel>(apiClient.get(userPaths.getMe), meMapper)
}

export const getUserDetailApi = async (
  userId: string,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<User>> => {
  return await handleRequest<User, UserDetailModel>(
    apiClient.get(userPaths.getDetail(userId)),
    userDetailMapper
  )
}

export const createUserApi = async (
  user: CreateUserDto,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<boolean>> => {
  return handleRequest(
    apiClient.post(userPaths.create, { json: user }),
    (data: any) => data
  )
}

export const updateUserApi = async (
  userId: string,
  user: UpdateUserDto,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<boolean>> => {
  return handleRequest(
    apiClient.put(userPaths.update(userId), { json: user }),
    (data: any) => data
  )
}

export const deleteUserApi = async (
  ids: string[],
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<boolean>> => {
  return handleRequest(
    apiClient.delete(userPaths.delete, { json: { ids } }),
    (data: any) => data
  )
}
