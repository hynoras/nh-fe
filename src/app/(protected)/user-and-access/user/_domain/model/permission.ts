export type PermissionModel = {
  id: string
  name: string
  description: string
}

export type PermissionGroupModel = {
  id: string
  name: string
  description: string
  permissions: PermissionModel[]
  created_at: string
  updated_at: string
}
