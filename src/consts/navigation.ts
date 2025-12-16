export const navigationKeys = {
  userAndAccess: "/user-and-access",
  setting: "/setting"
}

export const navigationRoutes = {
  userAndAccess: {
    user: {
      list: `${navigationKeys.userAndAccess}/user`,
      create: `${navigationKeys.userAndAccess}/user/create`
    },
    role: {
      list: `${navigationKeys.userAndAccess}/role`
    }
  },
  setting: {
    profile: "/setting/profile",
    preferences: "/setting/preferences"
  }
}
