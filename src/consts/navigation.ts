export const navigationKeys = {
  userAndAccess: "/user-and-access",
  setting: "/setting"
}

export const navigationRoutes = {
  userAndAccess: {
    user: {
      create: `${navigationKeys.userAndAccess}/user/create`,
      list: `${navigationKeys.userAndAccess}/user`,
      detail: (userId: string) => `${navigationKeys.userAndAccess}/user/${userId}`
    },
    role: {
      list: `${navigationKeys.userAndAccess}/role`,
      create: `${navigationKeys.userAndAccess}/role/create`,
      detail: (roleId: string) => `${navigationKeys.userAndAccess}/role/${roleId}`
    }
  },
  setting: {
    profile: "/setting/profile",
    preferences: "/setting/preferences"
  }
}
