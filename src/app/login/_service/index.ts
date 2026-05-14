import { User } from "app/(protected)/user-and-access/user/_domain/entity/user"
import { userDetailMapper } from "app/(protected)/user-and-access/user/_domain/mapper/user"
import { UserDetailModel } from "app/(protected)/user-and-access/user/_domain/model/user"
import { authPaths } from "consts/api"
import { httpClient } from "lib/api/http.client"
import { handleRequest } from "lib/api/request"
import { KyInstance } from "ky"
import { ApiResponse } from "types/response"
import { LoginDto } from "../_domain/dto/login"

export const loginApi = async (
  body: LoginDto,
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<User>> => {
  const response = await handleRequest<User, UserDetailModel>(
    apiClient.post(authPaths.login, { json: body }),
    userDetailMapper
  )

  if (!response.success) {
    throw new Error(response.message || response.error || "Login failed")
  }

  return response
}

export const logoutApi = async (
  apiClient: KyInstance = httpClient
): Promise<ApiResponse<boolean>> => {
  return await handleRequest<User, UserDetailModel>(
    apiClient.post(authPaths.logout),
    (data: any) => data,
    {
      success: true,
      failure: false
    }
  )
}
