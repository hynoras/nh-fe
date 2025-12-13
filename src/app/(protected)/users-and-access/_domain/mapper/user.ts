import { User } from "../entity/user"
import { UserDetailModel, UserListModel } from "../model/user"

export const userListMapper = (model: UserListModel[]): User[] => {
  return model.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  }))
}

export const userDetailMapper = (model: UserDetailModel): User => {
  return {
    id: model.id,
    username: model.username,
    email: model.email,
    role: model.role,
    createdAt: model.created_at,
    updatedAt: model.updated_at
  }
}
