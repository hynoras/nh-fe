import { Permission, PermissionGroup } from "../entity/permission"
import { PermissionGroupModel, PermissionModel } from "../model/permission"

export const permissionListMapper = (model: PermissionModel[]): Permission[] => {
  return model.map(permissionMapper)
}

export const permissionMapper = (model: PermissionModel): Permission => {
  return {
    id: model.id,
    name: model.name,
    description: model.description
  }
}

export const permissionGroupListMapper = (
  model: PermissionGroupModel[]
): PermissionGroup[] => {
  return model.map(permissionGroupMapper)
}

export const permissionGroupMapper = (model: PermissionGroupModel): PermissionGroup => {
  return {
    id: model.id,
    name: model.name,
    description: model.description,
    permissions: model.permissions?.map(permissionMapper) || [],
    createdAt: model.created_at,
    updatedAt: model.updated_at
  }
}
