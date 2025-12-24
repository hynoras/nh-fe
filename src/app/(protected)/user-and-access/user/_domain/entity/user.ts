import { PermissionGroup } from "app/(protected)/user-and-access/role/_domain/entity/permission"

export type User = {
  id?: string
  username?: string
  email?: string
  roles?: PermissionGroup[]
  permissionCodes?: string[]
  createdAt?: Date
  updatedAt?: Date
}
