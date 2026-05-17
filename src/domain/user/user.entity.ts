import { PermissionGroup } from "domain/permission/permission.entity"

export type User = {
  id?: string
  username?: string
  email?: string
  roles?: PermissionGroup[]
  permissionCodes?: string[]
  createdAt?: Date
  updatedAt?: Date
  version?: number
}
