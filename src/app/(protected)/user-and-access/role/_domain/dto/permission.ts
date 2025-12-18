export type CreatePermissionGroupDto = {
  name: string
  description: string
  permissions: string[]
}

export type UpdatePermissionGroupDto = {
  name?: string
  description?: string
  permissions?: string[]
}
