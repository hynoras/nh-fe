export type PermissionGroup = {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
}

export type UserListModel = {
  id: string
  username: string
  email: string
  role: string
  permission_groups: PermissionGroup[]
  created_at: string
  updated_at: string
}

export type UserDetailModel = {
  id: string
  username: string
  email: string
  role: string
  created_at: string
  updated_at: string
}
