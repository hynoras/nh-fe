export type Permission = {
  id?: string
  name?: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export type PermissionGroup = {
  id?: string
  name?: string
  description?: string
  permissions?: Permission[]
  createdAt?: string
  updatedAt?: string
}
