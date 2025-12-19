import { PermissionGroup } from "./permission"

export type User = {
  id?: string
  username?: string
  email?: string
  permissions?: PermissionGroup[]
  createdAt?: Date
  updatedAt?: Date
}
