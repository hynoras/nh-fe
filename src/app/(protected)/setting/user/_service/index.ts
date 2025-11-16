import { userPaths } from "consts/api"
import api, { handleRequest } from "lib/api"
import { ApiResponse } from "types/response"
import { User } from "../_domain/entity/user"
import { userDetailMapper, userListMapper } from "../_domain/mapper/user"
import { UserDetailModel, UserListModel } from "../_domain/model/user"

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
