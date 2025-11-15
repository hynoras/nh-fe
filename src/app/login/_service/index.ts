import { User } from "app/(protected)/setting/user/_domain/entity/user"
import { userDetailMapper } from "app/(protected)/setting/user/_domain/mapper/user"
import { UserDetailModel } from "app/(protected)/setting/user/_domain/model/user"
import { authPaths } from "consts/api"
import api, { handleRequest } from "lib/api"
import { ApiResponse } from "types/response"
import { LoginDto } from "../_domain/dto/login"

export const loginApi = async (body: LoginDto): Promise<ApiResponse<User>> => {
  const response = await handleRequest<User, UserDetailModel>(
    api.post(authPaths.login, { json: body }),
    userDetailMapper
  )

  if (!response.success) {
    throw new Error(response.message || response.error || "Login failed")
  }

  return response
}

export const logoutApi = async (): Promise<ApiResponse<boolean>> => {
  return await handleRequest<User, UserDetailModel>(
    api.post(authPaths.logout),
    (data: any) => data,
    {
      success: true,
      failure: false
    }
  )
}
