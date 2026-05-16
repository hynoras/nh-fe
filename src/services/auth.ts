import { User } from "app/(protected)/user-and-access/user/_domain/entity/user"
import { userDetailMapper } from "app/(protected)/user-and-access/user/_domain/mapper/user"
import { UserDetailModel } from "app/(protected)/user-and-access/user/_domain/model/user"
import { LoginDto } from "app/login/_domain/dto/login"
import { authPaths } from "consts/api"
import { KyInstance } from "ky"
import { httpClient } from "lib/api/http.client"
import { handleRequest } from "lib/api/request"
import { ApiResponse } from "types/response"

export const loginApi = async (
  body: LoginDto,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<User>> => {
  return await handleRequest<User, UserDetailModel>(
    apiClient.post(authPaths.login, { json: body }),
    userDetailMapper
  )
}

export const logoutApi = async (
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<null>> => {
  return await handleRequest<null>(apiClient.post(authPaths.logout))
}
