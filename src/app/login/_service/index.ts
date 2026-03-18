import { User } from "app/(protected)/user-and-access/user/_domain/entity/user"
import { userDetailMapper } from "app/(protected)/user-and-access/user/_domain/mapper/user"
import { UserDetailModel } from "app/(protected)/user-and-access/user/_domain/model/user"
import { authPaths } from "consts/api"
import { handleRequest } from "lib/handleRequest"
import { clientHttp } from "lib/http.client"
import { ApiResponse } from "types/response"
import { LoginDto } from "../_domain/dto/login"

export const loginApi = async (
  body: LoginDto
): Promise<ApiResponse<User>> => {
  const response = await handleRequest<User, UserDetailModel>(
    clientHttp.post(authPaths.login, { json: body }),
    userDetailMapper
  )

  if (!response.success) {
    throw new Error(response.message || response.error || "Login failed")
  }

  return response
}

export const logoutApi = async (): Promise<ApiResponse<boolean>> => {
  return await handleRequest<User, UserDetailModel>(
    clientHttp.post(authPaths.logout),
    (data: any) => data,
    {
      success: true,
      failure: false
    }
  )
}
