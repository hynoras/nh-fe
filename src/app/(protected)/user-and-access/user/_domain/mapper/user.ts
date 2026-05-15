import { permissionGroupMapper } from "app/(protected)/user-and-access/role/_domain/mapper/permission"
import { User } from "../entity/user"
import { MeModel, UserDetailModel, UserListModel } from "../model/user"

export const userListMapper = (model: UserListModel[]): User[] => {
  return model.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.permission_groups?.map(permissionGroupMapper) || [],
    createdAt: user.created_at,
    updatedAt: user.updated_at
  }))
}

export const userDetailMapper = (model: UserDetailModel): User => {
  return {
    id: model.id,
    username: model.username,
    email: model.email,
    roles: model.permission_groups?.map(permissionGroupMapper) || [],
    createdAt: model.created_at,
    updatedAt: model.updated_at,
    version: model.version
  }
}

export const meMapper = (model: MeModel): User => {
  return {
    id: model.id,
    username: model.username,
    email: model.email,
    permissionCodes: model.permissions || [],
    createdAt: model.created_at,
    updatedAt: model.updated_at
  }
}
