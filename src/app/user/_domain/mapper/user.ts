import { User } from "../entity/user"
import { UserDetailModel } from "../model/user"

export const userDetailMapper = (user: UserDetailModel): User => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}
