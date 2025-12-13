export type Permission = {
  id?: string
  name?: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export type User = {
  id?: string
  username?: string
  email?: string
  role?: string
  permissions?: Permission[]
  createdAt?: string
  updatedAt?: string
}
