import api, { handleRequest } from "lib/api"

import { User } from "app/user/_domain/entity/user"
import { userDetailMapper } from "app/user/_domain/mapper/user"
import { UserDetailModel } from "app/user/_domain/model/user"
import { ApiResponse } from "types/response"
import { LoginDto } from "../_domain/dto/login"

export const loginUser = async (body: LoginDto): Promise<ApiResponse<User>> => {
  return await handleRequest<User, UserDetailModel>(
    api.post("auth/login", { json: body }),
    userDetailMapper
  )
}
