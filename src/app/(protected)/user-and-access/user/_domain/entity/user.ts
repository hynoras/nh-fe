import { PermissionGroup } from "./permission"

export type User = {
  id?: string
  username?: string
  email?: string
  role?: string
  permissions?: PermissionGroup[]
  createdAt?: string
  updatedAt?: string
}
