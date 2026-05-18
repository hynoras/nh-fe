import { PermissionGroupModel } from "domain/permission/permission.model"
export type UserListModel = {
  id: string
  username: string
  email: string
  permission_groups: PermissionGroupModel[]
  created_at: Date
  updated_at: Date
}

export type UserDetailModel = {
  id: string
  username: string
  email: string
  permission_groups: PermissionGroupModel[]
  version: number
  created_at: Date
  updated_at: Date
}

export type MeModel = {
  id: string
  username: string
  email: string
  permissions: string[]
  created_at: Date
  updated_at: Date
}
