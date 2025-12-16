import { userPaths } from "consts/api"
import api, { handleRequest } from "lib/api"
import { ApiResponse } from "types/response"
import { CreateUserDto } from "../app/(protected)/user-and-access/user/_domain/dto/user"
import { User } from "../app/(protected)/user-and-access/user/_domain/entity/user"
import {
  userDetailMapper,
  userListMapper
} from "../app/(protected)/user-and-access/user/_domain/mapper/user"
import {
  UserDetailModel,
  UserListModel
} from "../app/(protected)/user-and-access/user/_domain/model/user"

export const getUserListApi = async (
  search: string,
  role: string,
  page: number,
  pageSize: number
): Promise<ApiResponse<User[]>> => {
  return await handleRequest<User[], UserListModel[]>(
    api.get(userPaths.getList(search, role, page, pageSize)),
    userListMapper
  )
}

export const getMeApi = async (): Promise<ApiResponse<User>> => {
  return await handleRequest<User, UserDetailModel>(
    api.get(userPaths.getMe),
    userDetailMapper
  )
}

export const getUserDetailApi = async (userId: string): Promise<ApiResponse<User>> => {
  return await handleRequest<User, UserDetailModel>(
    api.get(userPaths.getDetail(userId)),
    userDetailMapper
  )
}

export const createUserApi = async (
  user: CreateUserDto
): Promise<ApiResponse<boolean>> => {
  const response = await handleRequest(
    api.post(userPaths.create, { json: user }),
    (data: any) => data
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}

export const deleteUserApi = async (ids: string[]): Promise<ApiResponse<boolean>> => {
  const response = await handleRequest(
    api.delete(userPaths.delete, { json: { ids } }),
    (data: any) => data
  )
  if (!response.success) {
    throw new Error(response.message)
  }
  return response
}
