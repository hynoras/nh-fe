export type CreateUserDto = {
  username: string
  email: string
  password: string
  permissions?: string[]
}

export type UpdateUserDto = {
  username?: string
  email?: string
  permissions?: string[]
}
