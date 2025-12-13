import { Permission, User } from "../entity/user"
import { PermissionGroup, UserDetailModel, UserListModel } from "../model/user"

export const permissionGroupMapper = (model: PermissionGroup): Permission => {
  return {
    id: model.id,
    name: model.name,
    description: model.description,
    createdAt: model.created_at,
    updatedAt: model.updated_at
  }
}

export const userListMapper = (model: UserListModel[]): User[] => {
  return model.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    permissions: user.permission_groups?.map(permissionGroupMapper) || [],
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
