import { PermissionGroupModel } from "./permission"

export type UserListModel = {
  id: string
  username: string
  email: string
  role: string
  permission_groups: PermissionGroupModel[]
  created_at: string
  updated_at: string
}

export type UserDetailModel = {
  id: string
  username: string
  email: string
  role: string
  permission_groups: PermissionGroupModel[]
  created_at: string
  updated_at: string
}
