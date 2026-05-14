import { userPaths } from "consts/api"
import { httpClient } from "lib/api/http.client"
import { handleRequest } from "lib/api/request"
import { KyInstance } from "ky"
import { ApiResponse } from "types/response"
import {
  CreateUserDto,
  UpdateUserDto
} from "../app/(protected)/user-and-access/user/_domain/dto/user"
import { User } from "../app/(protected)/user-and-access/user/_domain/entity/user"
import {
  meMapper,
  userDetailMapper,
  userListMapper
} from "../app/(protected)/user-and-access/user/_domain/mapper/user"
import {
  MeModel,
  UserDetailModel,
  UserListModel
} from "../app/(protected)/user-and-access/user/_domain/model/user"

export const getUserListApi = async (
  search: string,
  page: number,
  pageSize: number,
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
  const response = await handleRequest(
    apiClient.post(userPaths.create, { json: user }),
    (data: any) => data
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}

export const updateUserApi = async (
  userId: string,
  user: UpdateUserDto,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<boolean>> => {
  const response = await handleRequest(
    apiClient.put(userPaths.update(userId), { json: user }),
    (data: any) => data
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}

export const deleteUserApi = async (
  ids: string[],
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<boolean>> => {
  const response = await handleRequest(
    apiClient.delete(userPaths.delete, { json: { ids } }),
    (data: any) => data
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}
