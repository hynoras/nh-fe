import { PermissionGroup } from "app/(protected)/user-and-access/role/_domain/entity/permission"

export type User = {
  id?: string
  username?: string
  email?: string
  permissions?: PermissionGroup[]
  createdAt?: Date
  updatedAt?: Date
}
