import { userPaths } from "consts/api"
import { handleRequest } from "lib/handleRequest"
import { clientHttp } from "lib/http.client"
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
import type { KyInstance } from "ky"

export const getUserListApi = async (
  search: string,
  page: number,
  pageSize: number,
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<User[]>> => {
  return await handleRequest<User[], UserListModel[]>(
    httpClient.get(userPaths.getList(search, page, pageSize)),
    userListMapper
  )
}

export const getMeApi = async (
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<User>> => {
  return await handleRequest<User, MeModel>(httpClient.get(userPaths.getMe), meMapper)
}

export const getUserDetailApi = async (
  userId: string,
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<User>> => {
  return await handleRequest<User, UserDetailModel>(
    httpClient.get(userPaths.getDetail(userId)),
    userDetailMapper
  )
}

export const createUserApi = async (
  user: CreateUserDto,
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<boolean>> => {
  const response = await handleRequest(
    httpClient.post(userPaths.create, { json: user }),
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
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<boolean>> => {
  const response = await handleRequest(
    httpClient.put(userPaths.update(userId), { json: user }),
    (data: any) => data
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}

export const deleteUserApi = async (
  ids: string[],
  httpClient: KyInstance = clientHttp
): Promise<ApiResponse<boolean>> => {
  const response = await handleRequest(
    httpClient.delete(userPaths.delete, { json: { ids } }),
    (data: any) => data
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}
