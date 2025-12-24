import { PermissionGroupModel } from "app/(protected)/user-and-access/role/_domain/model/permission"

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
